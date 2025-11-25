import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const activities = async () => {
    try 
    {
        const response = await axios.get(`${apiUrl}/api/activity`);
        
        if (response.status === 200) 
        {
            return response.data;    
        } 
        else 
        {
            return null;
        }
    } 
    catch (error) 
    {
        console.log(error)
        return ;
    }
};