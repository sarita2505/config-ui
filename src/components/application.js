import { useContext, useEffect, useState } from "react";
import { ConfigurationContext } from "./context";
import { Container, Card, Form, Button } from 'react-bootstrap';

function ApplicationList({ applicationList }) {
    return <>
        <div>
            <h2>Applications</h2>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {applicationList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

function ProfileList({ profileList }) {
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
                    </tr>
                </thead>
                <tbody>
                    {profileList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.version}</td>
                            <td>{item.name}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

function ConfigurationList({ configuration, clickHandler }) {
    // const configurationList = [];
    let item = configuration;
    return <>
        <div>
            <h2>Configurations</h2>
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
                            <button onClick={(event) => { clickHandler(event, { item: item, action: 'EDIT' }) }} className="btn btn-success">Edit</button>
                            <button onClick={(event) => { clickHandler(event, { item: item, action: 'DELETE' }) }} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </>
}

function ApplicationFormBuilder({ form, onChange, onSubmit }) {

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
                    <h5>Get All Applications</h5>
                    {/* <div>
                        <button onClick={getApplications()}>Get API Data</button>
                        {formData && (
                            <pre>{JSON.stringify(formData, null, 2)}</pre>
                        )}
                    </div>
                    ); */}
                </form>
            </Card>
        </Container>
        <br />

    </>
}

function ProfileFormBuilder({ profileData, onChange, onSubmit }) {
    return <>
        <div>
            <h1>create profile</h1>
            <form onSubmit={(event) => onSubmit(event)}>
                <div className="form-group">
                    <label>
                        Version:
                        <textarea className="form-control"
                            name="version"
                            value={profileData.version}
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
                            value={profileData.name}
                            onChange={onChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Status:
                        <textarea
                            name="status"
                            value={profileData.status}
                            onChange={onChange}
                        />
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </>
}

function ConfigurationFormBuilder({ configurationData, onChange, onSubmit }) {

    const configContext = useContext(ConfigurationContext);
    const action = configContext.action || 'CREATE';
    // configurationData = configContext.item || configurationData;
    return <>

        <h1>Configuration {configContext.id}</h1>
        <form onSubmit={(event) => onSubmit(event, action)}>
            <div className="form-group">
                <label>
                    Content:
                    <input className="form-control"
                        type="text"
                        name="content"
                        value={configurationData.content}
                        onChange={onChange}
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
                        onChange={onChange}
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
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({
        name: ''
    });

    const [profiles, setProfiles] = useState([]);
    const [profileData, setProfileData] = useState({
        version: '',
        name: '',
        status: '',
        applicationId: '0b75746f-befe-41dd-ab2a-60051bb9dc68'
    });

    const [configuration, setConfiguration] = useState({});
    const [configurationState, setConfigurationState] = useState({});
    const [configurationData, setConfigurationData] = useState({
        content: '',
        version: '',
        profileId: '9839752f-456d-4105-a692-0164560b3f4d'
    });

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

    function getProfiles() {
        let url = "http://localhost:9090/applications/" + profileData.applicationId;
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

    function getConfigurations() {

        let url = "http://localhost:9090/profiles/" + configurationData.profileId;
        return fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                console.log(res);
                throw new Error("response status is not 200 for url: " + url);
            }
            )
            .then(data => { setConfiguration(data.configuration) })
            .catch(error => { throw new Error('error while calling the url: ' + url) });
    }

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
                getConfigurations();
            })
            .catch((error) => {
                alert('Error submitting form for configuration:', error);
            });
    };

    const deleteConfigurationHandler = (id) => {
        // event.preventDefault();

        // Make the delete request using Fetch API for configurationById
        fetch('http://localhost:9090/config/' + id, {
            method: 'DELETE'
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(configurationData)
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data if needed
                alert('Form for configuration is successfully removed:', data);
            }).then(() => { getConfigurations(); })
            .catch((error) => {
                alert('Error in removing configuration:', error);
            });
    };


    const applicationFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const profileFormChange = (event) => {
        const { name, value } = event.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const configurationFormChange = (event) => {
        const { name, value } = event.target;
        setConfigurationData({ ...configurationData, [name]: value });
    };

    function configurationClickHandler(event, configuration) {
        event.preventDefault();
        if (configuration.action === 'EDIT') {
            setConfigurationData({ ...configurationData, ...configuration.item });
            setConfigurationState(configuration);
        }
        if (configuration.action === 'DELETE') {
            console.log(configuration.action, configuration.item);  // make call to delete
            deleteConfigurationHandler(configuration.item.id);
        }
    }
    useEffect(() => {
        // getApplications();
        getProfiles();
        getConfigurations();
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
export { ApplicationForm }