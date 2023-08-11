import {
  Grid, TextField, Typography, FormControlLabel, Checkbox,
  Button, Box, Alert, InputLabel, MenuItem, Select, FormControl, FormLabel,
  RadioGroup, Radio, FormGroup, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar
}
  from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useGetResumeProfileQuery, useSaveProfileMutation } from './services/candidateProfileAPI';
import { format } from 'date-fns';

function App() {
  const Input = styled('input')({
    display: 'none',
  });
  //States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState([])
  const [dob, setDob] = useState(null)
  const [st, setSt] = useState('')
  const [pimage, setPimage] = useState('')
  const [rdoc, setRdoc] = useState('')
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: " "
  })
  const [candidates, setCandidates] = useState([])

  //Multi Checkbox
  const getlocation = (e) => {
    //Destructuring
    const { value, checked } = e.target
    // console.log(`${value} is ${checked}`)

    if (checked) {
      setLocation([...location, value])
    } else {
      setLocation(location.filter((e) => e !== value))
    }
  }

  //Clear Form
  const resetForm = () => {
    setName('')
    setEmail('')
    setGender('')
    setLocation('')
    setDob(null)
    setSt('')
    setPimage('')
    setRdoc('')
    document.getElementById('resume-form').reset()
  }
  //RTK Query
  const [saveProfile] = useSaveProfileMutation()
  const { data, isSuccess } = useGetResumeProfileQuery()
  useEffect(() => {
    if (data && isSuccess) {
      console.log("Data:", data);
      setCandidates(data.candidate)
    }
  }, [data, isSuccess]
  )

  //Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.append('name', name)
    data.append('email', email)
    data.append('gender', gender)
    data.append('location', location)
    data.append('dob', dob == null ? null : format(dob, 'yyyy-MM-dd'))
    data.append('state', st)
    data.append('pimage', pimage)
    data.append('rdoc', rdoc)
    if (name && email) {
      const res = await saveProfile(data)
      if (res.data.status === "success") {
        setError({ status: true, msg: "Resume Uploaded Successfully", type: 'success' })
        resetForm()

      }
    } else {
      setError({ status: true, msg: "All Fields are Required", type: 'error' })
    }

  }
  return (
    <div>
      <Box display="flex" justifyContent="center"
        sx={{ backgroundColor: '#2c387e', padding: 2, marginBottom: 1 }}>
        <Typography variant='h5' component="div"
          sx={{ fontWeight: 'bold', color: 'white' }}>Resume Uploader</Typography>
      </Box>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={5}>
          <Box display="flex" justifyContent="center"
            sx={{ backgroundColor: '#6573c3', padding: 1 }}>
            <Typography variant='h5' component="div"
              sx={{ fontWeight: 'bold', color: 'white' }}>Fill in the Details</Typography>
          </Box>
          <Box component="form" noValidate id='resume-form' onSubmit={handleSubmit}>
            <TextField id='name' name='name' required fullWidth
              margin='normal' label='Name' onChange={(e) => { setName(e.target.value) }} />
            <TextField id='email' name='email' required fullWidth
              margin='normal' label='Email' onChange={(e) => { setEmail(e.target.value) }} />
            <Box mt={2}>
              {/* LocalizationProvider:- This is a context provider component that allows us to choose a 
              date-library that we want to use in our project for localization. */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker label="Date of Birth" value={dob} onChange={(newValue) => { setDob(newValue) }}
                  renderInput={(params) => <TextField{...params}/>}/>
              </LocalizationProvider>
            </Box>
            {/* FormControl is a component provided by Material-UI (MUI). 
            It is used as a container for form control elements such as InputLabel, 
            FormHelperText, Input, Select, Checkbox, Radio, etc. */}
            <FormControl fullWidth margin='normal'>
              <InputLabel id="state-elect-label">State</InputLabel>
              <Select labelId='state-elect-label' id="state-select" value={st} label='st' onChange={(e) => { setSt(e.target.value) }}>
                <MenuItem value='MH'>Maharashtra</MenuItem>
                <MenuItem value='GJ'>Gujarat</MenuItem>
                <MenuItem value='RJ'>Rajasthan</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <FormLabel id="gender-radio">Gender</FormLabel>
              <RadioGroup row name='gender' aria-labelledby='gender-radio'>
                <FormControlLabel value='male' control={<Radio />} label='Male' onChange={(e) => { setGender(e.target.value) }} />
                <FormControlLabel value='female' control={<Radio />} label='Female' onChange={(e) => { setGender(e.target.value) }} />
                <FormControlLabel value='other' control={<Radio />} label='Others' onChange={(e) => { setGender(e.target.value) }} />
              </RadioGroup>
            </FormControl>
            <FormControl component='fieldset' fullWidth margin='normal'>
              <FormLabel component='legend'>Prefereed Job Location:-</FormLabel>
              <FormGroup row>
                <FormControlLabel control={<Checkbox />} label='Nagpur' value='Nagpur' onChange={(e) => getlocation(e)} />
                <FormControlLabel control={<Checkbox />} label='Pune' value='Pune' onChange={(e) => getlocation(e)} />
                <FormControlLabel control={<Checkbox />} label='Bangalore' value='Bangalore' onChange={(e) => getlocation(e)} />
                <FormControlLabel control={<Checkbox />} label='Kolkata' value='Kolkata' onChange={(e) => getlocation(e)} />
                <FormControlLabel control={<Checkbox />} label='Delhi' value='Delhi' onChange={(e) => getlocation(e)} />
              </FormGroup>
            </FormControl>
            <Stack direction='row' alignItems='center' spacing={4}>
              <label htmlFor='profile-photo'>
                <Input accept="image/*" id="profile-photo" type="file"
                  onChange={(e) => { setPimage(e.target.files[0]) }} />
                <Button variant='contained' component='span' sx={{ backgroundColor: '#2c387e' }}>Upload Photo</Button>
              </label>
              <label htmlFor='resume-file'>
                <Input accept="doc/*" id="resume-file" type="file"
                  onChange={(e) => { setRdoc(e.target.files[0]) }} />
                <Button variant='contained' component='span' sx={{ backgroundColor: '#2c387e' }}>Upload File</Button>
              </label>
            </Stack>
            <Button type='submit' variant='contained'
              sx={{ mt: 3, mb: 2, px: 5, backgroundColor: '#6573c3' }}>Submit</Button>
            {error.status ? <Alert severity={error.type}>
              {error.msg}</Alert> : ''}
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box display="flex" justifyContent="center"
            sx={{ backgroundColor: '#6573c3', padding: 1 }}>
            <Typography variant='h5' component="div"
              sx={{ fontWeight: 'bold', color: 'white' }}>List of Candidates</Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple
           table">
              <TableHead>
                <TableRow>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>Name</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>Email</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>DOB</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>State</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>Gender</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>Location</Typography></TableCell>
                  <TableCell align='center'><Typography sx={{ fontWeight: 'bold' }}>Avatar</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { candidates.map((candidate, i) => {
                  return (
                    <TableRow key={i} sx={{'&:last-child td, &:lst-child th':{ border: 0 }}}>
                      <TableCell align='center'>{candidate.name}</TableCell>
                      <TableCell align='center'>{candidate.email}</TableCell>
                      <TableCell align='center'>{candidate.dob}</TableCell>
                      <TableCell align='center'>{candidate.state}</TableCell>
                      <TableCell align='center'>{candidate.gender}</TableCell>
                      <TableCell align='center'>{candidate.location}</TableCell>
                      <TableCell align='center'><Avatar src={`http://127.0.0.1:8000/.${candidate.pimage}`} /></TableCell>
                    </TableRow>
                  )
                })
                }

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
