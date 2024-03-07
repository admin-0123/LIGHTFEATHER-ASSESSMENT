import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { fetchSupervisors, register } from "./service";

// Styled component for form container
const ComponentContainer = styled.div`
  width: 700px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #c7d2d7;
  padding: 20px;
  color: #70848a;
  & > * {
    width: 100%;
  }
  & * {
    transition: 0.2s ease;
  }
  input {
    outline: none;
    background: white;
    padding: 10px;
    border: none;
    &:hover,
    &:focus {
      border-left: 2px solid dodgerblue;
    }
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 500;
  color: #22292a;
  background: #6b8085;
  border-radius: 5px 5px 0 0;
  line-height: 1;
  text-align: center;
  padding: 10px 0;
`;

// Styled component for form fields container
const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FormGroupItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  padding: 10px;
  label {
    margin-bottom: 3px;
  }
`;

const FormSubmitButton = styled.button`
  background: #6e8288;
  color: white;
  padding: 10px 25px;
  font-size: 19px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.85;
  }
`;

const FormSubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;

const StyledSelect = styled.select`
  /* Your styling for the select element */
  width: 300px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  outline: none;
  cursor: pointer;
`;

const StyledOption = styled.option`
  /* Your styling for the option element */
  background-color: #fff;
  color: #000;
`;

const SelectWrapper = styled.div`
  /* Any wrapper styles you may need */
  display: flex;
  justify-content: center;
`;

const FormComponent = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [byEmail, setByEmail] = useState(false);
  const [byPhone, setByPhone] = useState(false);
  const [superviser, setSuperviser] = useState("");

  const validateInputs = (userInput) => {
    let { firstName, lastName, supervisor } = userInput;

    let error = [];

    if (firstName.trim().length === 0) {
      error.push("Firstname is required");
    }

    if (lastName.trim().length === 0) {
      error.push("Lastname is required");
    }

    if (supervisor.trim().length === 0) {
      error.push("Supervisor is required");
    }

    return {
      isValid: error.length === 0,
      error,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: byEmail ? email : "",
      phone: byPhone ? phone : "",
      byEmail,
      byPhone,
      firstName: firstName,
      lastName: lastName,
      supervisor: superviser,
    };

    let { isValid, error } = validateInputs(userData);
    
    if (isValid) {
      try {
        let res = await register(userData);
        if (res.success) {
          NotificationManager.success("Register Success");
        }
      } catch (err) {
        NotificationManager.error(err.response.data.message);
      }
    } else {
      error.forEach((err) => {
        NotificationManager.error(err);
      });
    }
  };

  const [supervisorList, setSupervisorList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSupervisors();
        console.log(response);
        setSupervisorList([...response]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ComponentContainer>
      <Title>Notification Form</Title>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <FormGroupItem>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={({ target: { value } }) => setFirstName(value)}
            />
          </FormGroupItem>

          <FormGroupItem>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={({ target: { value } }) => setLastName(value)}
            />
          </FormGroupItem>
        </FormGroup>

        <FormGroup>
          <FormGroupItem>
            <label>How would you prefer to be noticed ?</label>
          </FormGroupItem>
        </FormGroup>
        <FormGroup>
          <FormGroupItem>
            <div style={{ display: "flex" }}>
              <input
                type="checkbox"
                checked={byEmail}
                onChange={() => {
                  setByEmail(!byEmail);
                }}
              />
              <label>email</label>
            </div>
            <input
              type="text"
              disabled={!byEmail}
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </FormGroupItem>

          <FormGroupItem>
            <div style={{ display: "flex" }}>
              <input
                type="checkbox"
                checked={byPhone}
                onChange={() => {
                  setByPhone(!byPhone);
                }}
              />
              <label>phone</label>
            </div>
            <input
              type="text"
              value={phone}
              disabled={!byPhone}
              onChange={({ target: { value } }) => setPhone(value)}
            />
          </FormGroupItem>
        </FormGroup>

        <FormGroup>
          <FormGroupItem>
            <div>Superviser</div>
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : supervisorList ? (
                <SelectWrapper>
                  <StyledSelect
                    value={superviser}
                    onChange={({ target: { value } }) => setSuperviser(value)}
                  >
                    <option value="" disabled >Select an option...</option>
                    {supervisorList &&
                      supervisorList.length > 0 &&
                      supervisorList.map((item) => {
                        return (
                          <StyledOption key={item} value={item}>
                            {item}
                          </StyledOption>
                        );
                      })}
                  </StyledSelect>
                </SelectWrapper>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </FormGroupItem>
        </FormGroup>

        <FormSubmitButtonContainer>
          <FormSubmitButton type="submit">Submit</FormSubmitButton>
        </FormSubmitButtonContainer>
      </FormContainer>
    </ComponentContainer>
  );
};

export default FormComponent;
