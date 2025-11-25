import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const registeruser = async(fullname,password,role,email,mobile,device,gpu_status) => {
    try 
    {
        const body = { fullname,password,role,email,mobile,device,gpu_status };
        const response = await axios.post(`${apiUrl}/register`,body);
        
        if (response.status === 201) 
        {
          console.log('Registration successful');
          return response.data;    
        } 
        else 
        {
            console.log('Registration failed')
            return response.data    
        }
    } 
    catch (error) 
    {
        throw error;
    }
}