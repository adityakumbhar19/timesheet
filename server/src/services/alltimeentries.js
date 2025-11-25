import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const alltimeentries = async (startDate,endDate,leaderId,uName) => {
    try 
    {
        const body = {startDate,endDate,leaderId,uName};
        const response = await axios.post(`${apiUrl}/api/allTimeEntries`,body);
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
}