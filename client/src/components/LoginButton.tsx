import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import Login from "./GoogleLogin";

export default function LoginButton(){
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    console.log("current user ",user);
    

    return isAuthenticated? (
        <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </Button>
    ):(
        <Button  className={'bg-blue-600'} onClick={()=>{
            Login();
        }}>Log in</Button>
    )
}

