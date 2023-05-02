import { Component } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout/Layout';
import { ContactList } from './ContactList/ContactList';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import initialContacts from './contacts.json';

const notificationMassege = 'is already in contacts!';
const notificationOptions = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

// render > didMount > getItem > setState > update > render > didUpdate > setItem

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  // стадія монтування
  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
     // Если сохранили в LS уже что-то, пишем ЭТО в state
    if (savedContacts !== null) {
      const parsedContacts = JSON.parse(savedContacts);
      this.setState({ contacts: parsedContacts });
      return;
    }
     // Если в LS ничего еще нет, пишем в state initialRecipes
    this.setState({ contacts: initialContacts });
  }

  // стадія оновлення
  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      // console.log(this.state.contacts); // поточне значення
      // console.log(prevState.contacts); // попереднє значення
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = newContact => {
    // перевірка на існуюче ім'я контакту
    if (
      this.state.contacts.some(
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
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  render() {
    const normalizeFilter = this.state.filter.toLocaleLowerCase();
    const visibleContacts = this.state.contacts
      .filter(contact =>
        contact.name.toLocaleLowerCase().includes(normalizeFilter)
      )
      .sort((firstName, secondName) =>
        firstName.name.localeCompare(secondName.name)
      );

    return (
      <Layout>
        <h1>Phonebook</h1>
        <ContactForm onSave={this.addContact} />

        <h2>Contacts</h2>
        <Filter value={this.state.filter} onSearch={this.changeFilter} />
        <ContactList items={visibleContacts} onDelete={this.deleteContact} />

        <ToastContainer />
        <GlobalStyle />
      </Layout>
    );
  }
}
