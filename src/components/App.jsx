import { useEffect, useState } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout/Layout';
import { ContactList } from './ContactList/ContactList';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import initialContacts from './contacts.json';
import {
  notificationMassege,
  notificationOptions,
} from './Notification/Notification';

// render > didMount > getItem > setState > update > render > didUpdate > setItem

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  // стадія монтування
  // componentDidMount() {
  //   const savedContacts = localStorage.getItem('contacts');
  //   // Если сохранили в LS уже что-то, пишем ЭТО в state
  //   if (savedContacts !== null) {
  //     const parsedContacts = JSON.parse(savedContacts);
  //     this.setState({ contacts: parsedContacts });
  //     return;
  //   }
  //   // Если в LS ничего еще нет, пишем в state initialRecipes
  //   this.setState({ contacts: initialContacts });
  // }

  // // стадія оновлення
  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.contacts !== prevState.contacts) {
  //     // console.log(this.state.contacts); // поточне значення
  //     // console.log(prevState.contacts); // попереднє значення
  //     localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
  //   }
  // }

  useEffect(() => {
    // массив зависимости - это под капотом оператор if
    //if (this.state.contacts !== prevState.contacts)
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = newContact => {
    // перевірка на існуюче ім'я контакту
    if (
      contacts.some(
        contact =>
          contact.name.toLocaleLowerCase() ===
          newContact.name.toLocaleLowerCase()
      )
    ) {
      // повідомлення
      toast.error(
        `${newContact.name} ${notificationMassege}`,
        notificationOptions
      );
      return;
    }
    // додавання нового контакту
    setContacts(prevState => [...prevState, newContact]);
  };

  const deleteContact = contactId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== contactId)
    );
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const normalizeFilter = filter.toLocaleLowerCase();
  const visibleContacts = contacts
    .filter(contact =>
      contact.name.toLocaleLowerCase().includes(normalizeFilter)
    )
    .sort((firstName, secondName) =>
      firstName.name.localeCompare(secondName.name)
    );

  return (
    <Layout>
      <h1>Phonebook</h1>
      <ContactForm onSave={addContact} />

      <h2>Contacts</h2>
      <Filter value={filter} onSearch={changeFilter} />

      <ContactList items={visibleContacts} onDelete={deleteContact} />

      <ToastContainer />
      <GlobalStyle />
    </Layout>
  );
};
