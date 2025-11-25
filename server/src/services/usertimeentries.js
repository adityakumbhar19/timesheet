import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const usertimeentries = async (startDate,endDate,uName) => {
    try 
    {
        const body = {startDate,endDate,uName};
        const response = await axios.post(`${apiUrl}/api/userTimeEntries`,body);
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