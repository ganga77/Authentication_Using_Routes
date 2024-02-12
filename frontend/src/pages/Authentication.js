import AuthForm from '../components/AuthForm';
import { json, redirect } from 'react-router-dom';
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({request}){
  const searchParams = new URL(request.url).searchParams; // Here we are extracting the params from the url
  const mode =searchParams.get('mode') || 'login';

  if(mode!== 'login' && mode !== 'signup'){
    throw json({message: 'Unsupported Mode'}, {status: 422})
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  };

  const response = await fetch('http://localhost:8080/' + mode,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(authData)
  });

  if(response.status === 422 || response.status === 401){
    return response;
  }

  if(!response.ok){
    throw json({message: 'Could not authenticate user'}, {status: 500})
  }

  //Extracting token for user loggedin
  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);
  return redirect('/')
}