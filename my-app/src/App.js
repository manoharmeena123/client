import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css'; // Import CSS file for additional styling
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  // State variables to manage form data and counts
  const [entries, setEntries] = useState([]);
  const [addCount, setAddCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch counts and entries on component mount
  useEffect(() => {
    getEntries();
    getCounts();
  }, []);

  // Function to fetch entries
  const getEntries = async () => {
    try {
      const response = await axios.get('https://data-neuron-server.vercel.app/api/v1/data');
      setEntries(response.data.GetData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Function to handle form submit for adding entry
  const handleClickAdd = async (values, { resetForm }) => {
    try {
      await axios.post('https://data-neuron-server.vercel.app/api/v1/data/create', values);
      resetForm();
      getCounts();
      getEntries();
      toast.success('Entry created successfully!');
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  // Function to handle form submit for updating entry
  const handleClickUpdate = async (values) => {
    try {
      await axios.put(`https://data-neuron-server.vercel.app/api/v1/data/${selectedEntry._id}`, values);
      toggleModal();
      getCounts();
      getEntries();
      toast.success('Entry updated successfully!');
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  // Function to fetch counts
  const getCounts = async () => {
    try {
      const response = await axios.get('https://data-neuron-server.vercel.app/api/v1/get/count');
      setAddCount(response.data.addCount);
      setUpdateCount(response.data.updateCount);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    toggleModal();
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <Container className="text-center mt-5">
        <h2>Add and Update the Entries</h2>
        <Formik
          initialValues={{ name: '', age: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required,please enter the name'),
            age: Yup.number().required('Age is required, please enter the age').positive('Age must be a positive number'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleClickAdd(values, { resetForm });
            setSubmitting(false);
          }}
        >
          <Form>
            <FormGroup>
              <Field as={Input} type="text" id="name" name="name" placeholder="Enter name" />
              <ErrorMessage name="name" component="div" className="error" />
            </FormGroup>
            <FormGroup>
              <Field as={Input} type="number" id="age" name="age" placeholder="Enter age" />
              <ErrorMessage name="age" component="div" className="error" />
            </FormGroup>
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </Container>
      <Container className="table-container">
        <div className="mt-5">
          <h2>Entries</h2>
          <Table style={{ overflowY: 'auto' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>#</th>
                <th style={{ textAlign: 'left' }}>Name</th>
                <th style={{ textAlign: 'left' }}>Age</th>
                <th style={{ textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} style={{ marginBottom: '12px' }}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.age}</td>
                  <td>
                    <Button onClick={() => handleEdit(entry)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
      <Container>
        <div className="counts mt-5">
          <h2>Counts</h2>
          <p>Add Count: {addCount}</p>
          <p>Update Count: {updateCount}</p>
        </div>
      </Container>
      <ToastContainer />

      {/* Modal for updating entry */}
      <Modal isOpen={modal} toggle={toggleModal} className="custom-modal">
        <ModalHeader toggle={toggleModal}>Update Entry</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ name: selectedEntry?.name || '', age: selectedEntry?.age || '' }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              age: Yup.number().required('Age is required').positive('Age must be a positive number'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              handleClickUpdate(values);
              setSubmitting(false);
              toggleModal(); // Close the modal after updating
            }}
          >
            <Form>
              <FormGroup>
                <Field as={Input} type="text" id="name" name="name" placeholder="Enter name" />
                <ErrorMessage name="name" component="div" className="error" />
              </FormGroup>
              <FormGroup>
                <Field as={Input} type="number" id="age" name="age" placeholder="Enter age" />
                <ErrorMessage name="age" component="div" className="error" />
              </FormGroup>
              <Button id="formik-submit-button" type="submit" style={{ display: 'none' }}></Button>
            </Form>
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button
            className="update-button"
            onClick={() => {
              document.getElementById("formik-submit-button").click(); 
            }}
          >
            Update
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default App;
