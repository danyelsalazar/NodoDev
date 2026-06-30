import { Publication } from "../models/PublicationModel";

const createPublication = async (req,res) =>{
    const data = req.body
    const newPublication = new Publication(data)
}