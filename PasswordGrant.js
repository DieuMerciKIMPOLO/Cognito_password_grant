//import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [state, setState] = useState({});
  const handleOnchange = (event)=>{
    setState({...state, [event.target.name]:event.target.value})
    console.log("state", state)
  }
  const loader =<div class="spinner-border text-warning" role="status"></div>
  const  onSubmit =(e)=>{
    e.preventDefault()
    setState({...state,loader:true, error:null, success:null})
    console.log("Reset error and success :",state)
    const region     ="****"
    const user_pool_id ="****"
    const oauth_url  =`https://cognito-idp.${region}.amazonaws.com/`
    const client_id ="*******"
    const headers = {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
    }
    const data ={
      "AuthParameters": {
          "USERNAME": state.email,
          "PASSWORD": state.password,
      },
      "AuthFlow": "USER_PASSWORD_AUTH",
      "UserPoolId":user_pool_id,
      "ClientId": client_id
    }
    axios.post(
      oauth_url, 
      data, 
      {
        'headers':headers
      })
      .then(response => {
        console.log(response)
        setState({...state,success:response.data.AuthenticationResult,loader:false})
        localStorage.setItem('auth', JSON.stringify(response.data.AuthenticationResult));
      })
      .catch((error)=>{
        console.log(error.response)
        setState({...state,error:error.response.data.message, loader:false})
        console.log("It's set!!!")
      });

  }
  return (
    <div className="App">
      {
        state.error?
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>{state.error}</strong> 
          <button onClick={()=>setState({...state,error:null})} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        :null
      }
      {
        state.success?
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Authenticated</strong> 
          <button onClick={()=>setState({...state,success:null})} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        :null
      }
      <form>
          <div className="mb-3">
            <input name="email" type="email" onChange={(e)=>handleOnchange(e)} value={state.email} placeholder="Email address" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
          </div>
          <div className="mb-3">
            <input onChange={(e)=>handleOnchange(e)} value={state.password} name="password" type="password" placeholder="Password" className="form-control" id="exampleInputPassword1"/>
          </div>
          {
            state.loader?loader:
            <button type="submit" onClick={(e)=>onSubmit(e)} className="btn btn-primary">Submit</button>
          }
          
        </form>
        {
          state.success?
          <table>
            <tr>
              <th>AccessToken</th>
              <th>{state.success.AccessToken}</th>
            </tr>
            <tr>
              <th>IdToken</th>
              <th>{state.success.IdToken}</th>
            </tr>
          </table>
          :null
        }
    </div>
  );
}

export default App;

/*
AccessToken: ""
ExpiresIn: 3600
IdToken: ""
TokenType: "Bearer"
*/
