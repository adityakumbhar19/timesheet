import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const deleterecord = async (EntryID) => {
    console.log(EntryID,"entryid service")
    const response = await axios.delete(`${apiUrl}/api/delete/${EntryID}`);
    try 
    {
        if (response.status === 200) 
        {
            return 'deleted record with id : '+EntryID;    
        } 
        else 
        {
            return null;
        }
    } 
    catch (error) 
    {
        console.log('Error during deleting record : ',error);
        return null;
    }
}