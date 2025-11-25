import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const depts = async () => {
    try 
    {
        const response = await axios.get(`${apiUrl}/api/depts`);

        if (response.status === 200) {
            return response.data;
        } 
        else 
        {
            return null;
        }
    }
    catch (error) 
    {
        console.error('Error during fetching depts : ',error);
        return null;
    }
};