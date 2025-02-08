import axios from 'axios';

const API_URL = 'http://localhost:3000/seminars';

export type Seminar = {
    id: number;
    title: string;
    description: string;
    date: string; 
    time: string; 
    photo: string; 
};

//Получение списка семинаров
export const getSeminars = async (): Promise<Seminar[]> => {
    const response = await axios.get<Seminar[]>(API_URL);
    return response.data;
};

//Удаление семинара
export const deleteSeminar = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

//Изменение данных о семинаре
export const updateSeminar = async (id: number, seminarData: Seminar): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, seminarData);
};
