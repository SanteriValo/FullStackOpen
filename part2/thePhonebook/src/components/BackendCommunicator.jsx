import axios from "axios";

const mainUrl = 'http://localhost:3001/persons';

const getAllPersons = () => {
    return axios.get(mainUrl);
}

const addPerson = (newPerson) => {
    return axios.post(mainUrl, newPerson);
}

const update = (id, updatedPerson) => {
    return axios.put(`${mainUrl}/${id}`, updatedPerson);
}

const remove = (id) => {
    return axios.delete(`${mainUrl}/${id}`);
}

const updatePerson = (id, updatedPerson) => {
    return axios.put(`${mainUrl}/${id}`, updatedPerson);
}

export default {getAllPersons, addPerson, update, remove, updatePerson}