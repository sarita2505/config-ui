import { useEffect, useState } from "react";

function ApplicationForm() {
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({
        name: ''
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
    const handleSubmit = (event) => {
        event.preventDefault();

        // Make the POST request using Fetch API
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
                alert.Error('Error submitting form:', error);
            });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
      };
    useEffect(() => {
        getApplications();
    });

    return <>
        <div>
            <h2>Table Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <h1>create application</h1>
        <form onSubmit={(event) => handleSubmit(event)}>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    </>
}
export { ApplicationForm }