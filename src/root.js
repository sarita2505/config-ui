import logo from './logo.svg';
import './App.css';
import { ApplicationForm, ConfigurationFormBuilder, ConfigurationList, MyComponent, ProfileForm } from './components/application';
import { Route, Routes } from 'react-router';

function Root() {
    return <>

        <div className='container'>

            <Routes>
                <Route path='applications/:id/profiles' element={<ProfileForm />} />
                <Route path='/' element={<ApplicationForm />} />
                <Route path='/profiles/:id/config' element={<ConfigurationFormBuilder />} />
                <Route path='/profiles/:id/config-list' element={<ConfigurationList />} />
            </Routes>
        </div>

    </>
}

export default Root;
