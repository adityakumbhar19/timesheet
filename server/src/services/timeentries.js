import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const timeentries = async ( timeEntry ) => {

    const obj={
        timeEntry
    }

    try 
    {
        const response = await axios.post(`${apiUrl}/api/submitHours`, obj);
        if (response.status === 201) 
        {
            return response.data;   
        }
        else
        {
            console.log(response)
            return null;
        }
    }
    catch (error) 
    {
        console.error('Error during time entry : ',error);
        return null;
    }
}