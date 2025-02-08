import React, { FC, useEffect, useState } from 'react';
import { getSeminars, deleteSeminar, updateSeminar, Seminar } from './api/api.ts';
import './App.css';

const App: FC = () => {
    const [seminars, setSeminars] = useState<Seminar[]>([]);
    const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');
    const [newDate, setNewDate] = useState<string>(''); 
    const [newTime, setNewTime] = useState<string>('');
    const [newPhoto, setNewPhoto] = useState<string>('');
    const [appError, setAppError] = useState<string>(''); 
    const [dateError, setDateError] = useState<string>(''); 
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSeminars = async () => {
        try {
            setLoading(true);
            const data = await getSeminars();
            setSeminars(data);
        } catch (err) {
            setAppError('Ошибка при загрузке семинаров: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSeminar = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот семинар?')) {
            try {
                await deleteSeminar(id);
                fetchSeminars();
            } catch (err) {
                setAppError('Ошибка при удалении семинара: ' + (err as Error).message);
            }
        }
    };

    const handleEditSeminar = (seminar: Seminar) => {
        setSelectedSeminar(seminar);
        setNewTitle(seminar.title);
        setNewDescription(seminar.description);
        setNewDate(seminar.date); 
        setNewTime(seminar.time);
        setNewPhoto(seminar.photo);
        setIsEditing(true);
        setDateError(''); 
        setAppError(''); 
    };

    // Функция проверки формата даты
    const isValidDate = (dateString: string): boolean => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/; 
        return regex.test(dateString);
    };

    // Функция для обработки отправки формы редактирования
    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidDate(newDate)) {
            setDateError('Дата должна быть в формате dd.mm.yyyy'); 
            return;
        } else {
            setDateError(''); 
        }

        if (selectedSeminar) {
            try {
                await updateSeminar(selectedSeminar.id, {
                    id: selectedSeminar.id,
                    title: newTitle,
                    description: newDescription,
                    date: newDate, 
                    time: newTime,
                    photo: newPhoto,
                });
                fetchSeminars(); // Обновляем список семинаров после изменения
                setIsEditing(false); // Выходим из режима редактирования
                setSelectedSeminar(null); // Сбрасываем выбранный семинар
            } catch (err) {
                setAppError('Ошибка при обновлении семинара: ' + (err as Error).message); 
            }
        }
    };

    // Получаем семинары при первом рендере компонента
    useEffect(() => {
        fetchSeminars();
    }, []);

    return (
        <div className="App">
            <h1>Список семинаров</h1>
            {loading && <p>Загрузка...</p>}
            {appError && <p style={{ color: 'red' }}>{appError}</p>}
            <ul>
                {seminars.map(seminar => (
                    <li key={seminar.id}>
                        <h2>{seminar.title}</h2>
                        <p>{seminar.description}</p>
                        <p>{seminar.date} в {seminar.time}</p>
                        <img src={seminar.photo} alt={seminar.title} style={{ width: '150px', height: 'auto' }} />
                        <button onClick={() => handleDeleteSeminar(seminar.id)}>Удалить</button>
                        <button onClick={() => handleEditSeminar(seminar)}>Редактировать</button>
                    </li>
                ))}
            </ul>

            {isEditing && ( // Показываем форму редактирования, если в режиме редактирования.
                <div className="modal">
                    <form onSubmit={handleEditSubmit}>
                    <h2>Редактировать семинар</h2>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Название"
                            required
                        />
                        <input
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Описание"
                            required
                        />
                        <input
                            type="text" 
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            placeholder="dd.mm.yyyy"
                            required
                        />
                        {dateError && <p className="date-error" style={{ color: 'red' }}>{dateError}</p>} 
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            value={newPhoto}
                            onChange={(e) => setNewPhoto(e.target.value)}
                            placeholder="URL фотографии"
                            required
                        />
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default App;
