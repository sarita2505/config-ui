import { useContext, useEffect, useState } from "react";
import { ConfigurationContext, ProfileContext } from "./context";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link, useParams, useSearchParams } from 'react-router-dom';

function ApplicationList({ applicationList }) {
    return <>
        <div>
            <h2>Applications</h2>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applicationList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>

                                <Link to={`applications/${item.id}/profiles`}>Go to Profiles Page</Link>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}



function ConfigurationList() {

    function configurationClickHandler(event, configuration) {
        event.preventDefault();
        if (configuration.action === 'EDIT') {
            //  setConfigurationData({ ...configurationData, ...configuration.item });
            //  setConfigurationState(configuration);
        }
        if (configuration.action === 'DELETE') {
            console.log(configuration.action, configuration.item);  // make call to delete
            deleteConfigurationHandler(configuration.item.id);
        }
    }
    let { id } = useParams();
    let [configuration, setConfiguration] = useState({});

    useState(() => {
        getConfigurations(id);
    }, [])

    const deleteConfigurationHandler = (event, { item, action }) => {
        // event.preventDefault();

        // Make the delete request using Fetch API for configurationById
        fetch('http://localhost:9090/config/' + item.id, {
            method: 'DELETE'
        })
            .then((response) => {
                console.log(response.status);
                return response.status
            })
            .then((data) => {
                // Handle the response data if needed
                alert('Form for configuration is successfully removed:', data);
            }).then(() => { getConfigurations(id); })
            .catch((error) => {
                alert('Error in removing configuration:', error);
            });
    };

    function getConfigurations(id) {

        let url = "http://localhost:9090/profiles/" + id;
        return fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                console.log(res);
                throw new Error("response status is not 200 for url: " + url);
            }
            )
            .then(data => {
                setConfiguration(data.configuration);
            })
            .catch(error => { throw new Error('error while calling the url: ' + url) });
    }


    // const configurationList = [];
    let item = configuration;
    return <>
        <div>
            <h2>Configurations |
                <Link to={`${window.location.origin}/profiles/${id}/config`}>New</Link>
            </h2>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th>Version</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.content}</td>
                        <td>{item.version}</td>
                        <td>
                            {/* <button onClick={(event) => { clickHandler(event, { item: item, action: 'EDIT' }) }} className="btn btn-success">Edit</button> */}
                            <button onClick={(event) => { deleteConfigurationHandler(event, { item: item, action: 'DELETE' }) }} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </>
}

function ApplicationFormBuilder({ form, onChange, onSubmit }) {
    const [applications, setApplications] = useState([]);
    function getApplications() {
        let url = "http://localhost:9090/applications";
        return fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("response status is not 200 for url: " + url);
            }
            )
            .then(data => { setApplications(data) })
            .catch(error => { throw new Error('error while calling the url: ' + url) });
    }

    return <>
        <Container className="mt-5">
            <Card className="p-4" style={{ backgroundColor: '#add8e6', border: '3px solid #4169e1', borderRadius: '10px' }}>
                {/* <h1>Create Application</h1> */}
                <form onSubmit={(event) => onSubmit(event)}>
                    <div className="container mt-5" />
                    {/* <div className="card p-4" /> */}
                    <h2 className="text-center mb-4 text-Royal Blue">Application Form</h2>
                    <h5>Create Application</h5>
                    <div className="form-group">
                        <label>
                            Name:
                            <input className="form-control"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="Application Name"
                            />
                        </label>
                    </div>
                    <button variant="primary" type="submit" className="btn btn-primary">Submit</button>
                    <br /> <br />
                </form>
                <h5>Get All Applications</h5>
                <div>
                    <button className="btn btn-primary" onClick={(event) => { getApplications() }}>Get API Data</button>
                    {
                        applications.length > 0 && <ApplicationList applicationList={applications} />
                    }
                </div>


            </Card>
        </Container>
        <br />

    </>
}


function ConfigurationFormBuilder() {

    const [configurationData, setConfigurationData] = useState({
        content: '',
        version: '',
        profileId: ''
    });

    let { id } = useParams();
    useState(() => {
        setConfigurationData({ ...configurationData, profileId: id })
    }, []);
    const configurationFormChange = (event) => {
        const { name, value } = event.target;
        setConfigurationData({ ...configurationData, [name]: value });
    };

    const makeConfigurationHandler = (event, action) => {
        event.preventDefault();
        if (action === 'EDIT') {
            console.log(action);
            updateConfigurationHandler();
            return;
        }
        createConfigurationHandler(event);
    }
    const createConfigurationHandler = (event) => {
        event.preventDefault();

        // Make the POST request using Fetch API for configurationById
        fetch('http://localhost:9090/config/' + configurationData.profileId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configurationData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form submission for configuration is successful:', data);
            })
            .catch((error) => {
                alert('Error submitting form for configuration:', error);
            });
    };

    const updateConfigurationHandler = () => {
        //event.preventDefault();

        // Make the POST request using Fetch API for configurationById
        fetch('http://localhost:9090/config/' + configurationData.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configurationData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form submission for configuration is successful:' + configurationData.profileId);
            }).then(() => {
                alert(configurationData.profileId);
            })
            .catch((error) => {
                alert('Error submitting form for configuration:', error);
            });
    };



    const configContext = useContext(ConfigurationContext);
    const action = 'CREATE';
    // configurationData = configContext.item || configurationData;
    return <>

        <h1>Configuration  </h1>
        <Link to={`${window.location.origin}/profiles/${id}/config-list`}>List</Link>

        <form onSubmit={(event) => makeConfigurationHandler(event, action)}>
            <div className="form-group">
                <label>
                    Content:
                    <input className="form-control"
                        type="text"
                        name="content"
                        value={configurationData.content}
                        onChange={configurationFormChange}
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Version:
                    <input className="form-control"
                        type="text"
                        name="version"
                        value={configurationData.version}
                        onChange={configurationFormChange}
                    />
                </label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <br />
        </form>
        <br />
    </>
}


function ApplicationForm() {
    const [formData, setFormData] = useState({
        name: ''
    });



    const createApplicationHandler = (event) => {
        event.preventDefault();

        // Make the application POST request using Fetch API
        fetch('http://localhost:9090/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form submission successful:', data);
            })
            .catch((error) => {
                alert('Error submitting form:', error);
            });
    };


    const applicationFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };


    useEffect(() => {
        // getApplications();
        // getProfiles();
        // getConfigurations();
    }, []);

    return <>

        <
            ApplicationFormBuilder form={formData}
            onChange={applicationFormChange}
            onSubmit={createApplicationHandler} />
        {/* <ApplicationList applicationList={applications} /> */}
        {/* <ProfileList profileList={profiles} />
        <ProfileFormBuilder profileData={profileData}
            onChange={profileFormChange}
            onSubmit={createProfileHandler} />

        <ConfigurationContext.Provider value={configurationState}>
            <ConfigurationList configuration={configuration} clickHandler={configurationClickHandler} />
            <ConfigurationFormBuilder configurationData={configurationData}
                onChange={configurationFormChange}
                onSubmit={makeConfigurationHandler} />
        </ConfigurationContext.Provider> */}
    </>
}


function ProfileFormBuilder({ formData,
    onChange,
    onSubmit,
    profileClickHandler }) {

    const [profiles, setProfiles] = useState([]);


    function getProfiles() {
        let url = "http://localhost:9090/applications/" + formData.applicationId;
        console.log(url);
        return fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                console.log(res);
                throw new Error("response status is not 200 for url: " + url);
                // return [];
            }
            )
            .then(data => { setProfiles(data.profiles) })
            .catch(error => { throw new Error('error while calling the url: ' + url) });
    }


    const profileConfigContext = useContext(ProfileContext);
    const action = profileConfigContext.action || 'CREATE';
    return <>
        <div className="mt-5">
            <div className="p-4" style={{ backgroundColor: '#add8e6', border: '3px solid #4169e1', borderRadius: '10px' }}>

                <div>
                    <h2 className="text-center mb-4 text-Royal Blue">Profile Form</h2>

                    <h5>create profile</h5>
                    <form onSubmit={(event) => onSubmit(event)}>
                        <div className="form-group">
                            <label>
                                Version:
                                <input className="form-control"
                                    name="version"
                                    value={formData.version}
                                    onChange={onChange}
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Name:
                                <input className="form-control"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Status:
                                <input className="form-control"
                                    name="status"
                                    value={formData.status}
                                    onChange={onChange}
                                />
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <h5>Get Profile Data</h5>
                <div>
                    <button className="btn btn-primary" onClick={(event) => { getProfiles() }}>Get API Data</button>
                    {
                        profiles.length > 0 && <ProfileList
                            profileList={profiles} profileClickHandler={profileClickHandler}
                        />
                    }
                </div>
            </div>
        </div>
    </>
}

function ProfileList({ profileList, profileClickHandler }) {


    return <>
        <div>
            <h2>Profiles</h2>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Version</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {profileList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.version}</td>
                            <td>{item.name}</td>
                            <td>{item.status}</td>
                            <td>
                                <Link to={`${window.location.origin}/profiles/${item.id}/config`}>Config</Link>
                                <button onClick={(event) => { profileClickHandler(event, { item: item, action: 'EDIT' }) }} className="btn btn-success">Edit</button>
                                <button onClick={(event) => { profileClickHandler(event, { item: item, action: 'DELETE' }) }} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

const ProfileForm = () => {

    const [profileState, setProfileState] = useState({});

    const [profileData, setProfileData] = useState({
        version: '',
        name: '',
        status: '',
        applicationId: ''
    });

    let { id } = useParams();

    function profileClickHandler(event, row) {
        event.preventDefault();
        if (row.action === 'EDIT') {
            setProfileData({ ...profileData, ...row.item });
            setProfileState(row);
        }
        if (row.action === 'DELETE') {
            deleteProfileHandler(row.item.id);
        }
    }

    useEffect(() => {
        setProfileData({ ...profileData, applicationId: id });
    }, [])



    const profileFormChange = (event) => {
        console.log(event.target.value);
        const { name, value } = event.target;
        setProfileData({ ...profileData, [name]: value });
    };


    const createProfileHandler = (event) => {
        event.preventDefault();

        // Make the POST request using Fetch API for profileById
        fetch('http://localhost:9090/profiles/' + profileData.applicationId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form submission for profile is successful:', data);
            })
            .catch((error) => {
                alert('Error submitting form for profile:', error);
            });
    };

    const updateProfileHandler = () => {
        // event.preventDefault();

        // Make the POST request using Fetch API for profileById
        fetch('http://localhost:9090/profiles/' + profileData.applicationId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form submission for profile is successful:', data);
            })
            .catch((error) => {
                alert('Error submitting form for profile:', error);
            });
    };
    const deleteProfileHandler = (id) => {
        // event.preventDefault();

        // Make the POST request using Fetch API for profileById
        fetch('http://localhost:9090/profiles/' + id, {
            method: 'DELETE'
        })
            .then((response) => {
                console.log(response.status);
                return response.status;
            })
            .then((data) => {
                // Handle the response data if needed
                alert('Form deleted for profile is successful:', data);
            })
            .catch((error) => {
                alert('Error in deleting form for profile:', error);
            });
    };
    const makeProfileHandler = (event, action) => {
        event.preventDefault();
        if (action === 'EDIT') {
            console.log(action);
            updateProfileHandler();
            return;
        }
        createProfileHandler(event);
    }
    return <>
        <ProfileContext.Provider value={profileState}>
            <ProfileFormBuilder formData={profileData}
                onChange={profileFormChange}
                onSubmit={makeProfileHandler}
                profileClickHandler={profileClickHandler}

            />
        </ProfileContext.Provider>
    </>
}

const MyComponent = () => {
    return (
        <div>
            <h1>Welcome to My Component</h1>
            <p>Click the link to go to another page:</p>
            <Link to="/other-page">Go to Profiles Page</Link>
        </div>
    );
};

export {
    ApplicationForm,
    MyComponent,
    ProfileForm,
    ConfigurationFormBuilder, ConfigurationList
}