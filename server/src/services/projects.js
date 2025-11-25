import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const projects = async (departmentid,userid) => {
    try 
    {
        const response = await axios.get(`${apiUrl}/api/projects/${departmentid}/${userid}`);
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
        console.error('Error during fetching projects : ',error);
        return null;
    }
}