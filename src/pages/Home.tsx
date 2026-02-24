import axios from "axios";

export default function Home() {
    const  handleClick = async () => {
        try{

            const data=await axios.get("http://155.117.43.95:8000/auth/me",{
                withCredentials:true
            });
            console.log( data);
        }
        catch(error){
            console.error("Error fetching user data:", error);
        }
    };
    return (
    <div>Home
        <button onClick={handleClick}>Click me</button>
    </div>
    )
}
