import axios from "axios";

const mainUrl = 'http://localhost:3001/api/persons';

const getAllPersons = () => {
    return axios.get(mainUrl);
}

const addPerson = (newPerson) => {
    return axios.post(mainUrl, newPerson);
}

const remove = (id) => {
    return axios.delete(`${mainUrl}/${id}`);
}

const updatePerson = (id, updatedPerson) => {
    return axios.put(`${mainUrl}/${id}`, updatedPerson);
}

export default {getAllPersons, addPerson, remove, updatePerson};