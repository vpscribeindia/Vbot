import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { FormControl, InputLabel, Select, MenuItem,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Accordion, AccordionSummary, AccordionDetails,Button, Card, CardContent, CardActions,CardActionArea, TextField, Box, IconButton } from "@mui/material";
import { ContentCopy, Mic, Stop,DeleteForever,Edit,Done, AccessTime,VisibilityOff, Visibility,ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import ReactAudioPlayer from 'react-audio-player';
import { toast } from "react-toastify";
const API_MAIN_URL=import.meta.env.VITE_API_URL;
const socket = io(API_MAIN_URL);
import BillingPopup from "../components/Bill";
//only for testing purpose
// const token="";
const Dashboard = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [PatientName, setPatientName] = useState("");
  const [jobStatuses, setJobStatuses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [editedTranscript, setEditedTranscript] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState(new Set());
  const [conversationTranscript, setConversationTranscript] = useState(null);
  const [templateName, setTemplateName] = useState("");

  const [templates, setTemplates] = useState([]);
  const [Templatevalue, setTemplatevalue] = useState("");
  const [remainingMinutes, setremainingMinutes] = useState("");



  const API_URL = `${API_MAIN_URL}/api/transcribe`;
  const PROGRESS_API_URL = `${API_MAIN_URL}/api/progress`;
  const FORMAT_API_URL = `${API_MAIN_URL}/api/reformatthis`;

  const GET_ALL_FILES_URL = `${API_MAIN_URL}/api/fetchall`; 
  const DELETE_FILE = `${API_MAIN_URL}/api/deletefile`; 
  const UPDATE_TRANSCRIPT_URL = `${API_MAIN_URL}/api/updatetranscript`;
  const GET_ALL_TEMPLATE_URL = `${API_MAIN_URL}/api/fetchalltemplates`;
  const UPDATE_PATIENT_NAME_URL = `${API_MAIN_URL}/api/updatepatientname`;

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedName, setEditedName] = useState("");

  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await axios.get(`${API_MAIN_URL}/auth/logout`);
    toast.error('Logged out Successfully!');
    navigate('/login');
  };


  const handleEditClick = (job) => {
    setSelectedPatient(job);
    setEditedName(job.PatientName || "");
    setEditModalOpen(true);
  };
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setTemplatevalue(newValue);
    onChange?.(newValue);
  };

  
  const handleChangefetched = async (event) => {
    const newTemplateName = event.target.value;

    try {
      await axios.post(FORMAT_API_URL, {
        fileId: selectedJob,
        templateName: newTemplateName,
      }, {
        withCredentials: true,
      });
  
      handleJobClick(selectedJob);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
 
  const handleOpen = (fileId) => {
    setSelectedFileId(fileId);
    setOpenConfirmation(true);
  };

  const handleClose = () => {
    setOpenConfirmation(false);
    setSelectedFileId(null);
  };

  const confirmDelete = () => {
    if (selectedFileId) {
      handleDelete(selectedFileId);
    }
    handleClose();
  };
  const handleUpdatePatientName = async () => {
    try {
      await axios.post(UPDATE_PATIENT_NAME_URL, {
        fileId: selectedPatient.fileId,
        patientName: editedName,
      },{
        withCredentials: true,
      });
      setJobStatuses((prev) =>
        prev.map((j) =>
          j.fileId === selectedPatient.fileId ? { ...j, PatientName: editedName } : j
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  }
  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpandedIndexes(expandAll ? new Set() : new Set(parseJSONTranscript(selectedTranscript).map((s) => s.index)));
  };

  const toggleSingleExpand = (index) => {
    setExpandedIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };
  const handleUpdateTranscript = async () => {
    if (!selectedJob || Object.keys(changedFields).length === 0) return; // Prevent empty request

    try {
      await axios.put(UPDATE_TRANSCRIPT_URL, {
        fileId: selectedJob,
        transcript: changedFields, 
      },{
        withCredentials: true,
        
      });
      setChangedFields({});
    } catch (error) {
      console.error("Error updating transcript:", error);
    }
  };
  

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get(GET_ALL_FILES_URL, {
          withCredentials: true
        });
        const response = await axios.get(GET_ALL_TEMPLATE_URL,{
          withCredentials: true
        });
        const response1 = await axios.get(`${API_MAIN_URL}/api/getBillingByMinutes`,{
          withCredentials: true
        }
      );
      const minutes = Math.floor(response1.data.usage_limit / 60);
      setremainingMinutes(minutes);

      // ✅ Send mail only ONCE when minutes ≤ 10
      if (minutes <= 10) {
        try {
          await axios.post(`${API_MAIN_URL}/auth/sendemail`, {
            to: 'gokuldev@vpscribes.com',
            subject: 'Plan Upgrade',
            text: `Your plan will expire soon. Only ${minutes} minutes remaining. Please upgrade.`,
          });
          toast.success('Email sent');
        } catch (err) {
          console.error(err);
          toast.error('Failed to send email');
        }
      }
        setJobStatuses(data);
          const list = response.data.templateNames || [];
          setTemplates(list);
          // set default to index 2 if available
          if (list.length > 2) {
            const defaultValue = list[2];
            setTemplatevalue(defaultValue);
          }
        
        
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
    const handleProgress = (data) => {

      setJobStatuses((prevJobs) => {
        const index = prevJobs.findIndex((job) => job.fileId === data.fileId);
        if (index !== -1) {
          const updatedJobs = [...prevJobs];
          updatedJobs[index] = { ...updatedJobs[index], ...data };
          return updatedJobs;
        }
        return [data,...prevJobs];
      });
    };

    const handleProgresstranscript = (data) => {
      setTranscriptLoading(true); 
      if (data.status === "completed" || data.status === "failed") {
        setTranscriptLoading(false);
        handleJobClick(data.fileId);
      }
    };
  
    socket.on("progress", handleProgress);
    socket.on('progress_transcript', handleProgresstranscript);
  
    return () => {
      socket.off("progress", handleProgress);
      socket.off('progress_transcript', handleProgresstranscript);
    };
  }, []); 




  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFiles([file]);
    }
    setUploadStatus("");

  };
 
  const handleUpload = async () => {
    if (selectedFiles.length === 0 || PatientName === "" || Templatevalue === "" ) return;
    setUploadStatus("Uploading and processing...");
    if (fileInputRef.current) {
        fileInputRef.current.value = null; 
      }

    const formData = new FormData();
    formData.append("audioFiles", selectedFiles[0]);
    formData.append("patientName", PatientName);
    formData.append("templateName", Templatevalue);

    try {
      const { data } = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",            
        },
        withCredentials: true,
      });
      

      setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);
      const minutes = Math.floor(data.usage_limit / 60);
      setremainingMinutes(minutes);
      setUploadStatus("Upload successful!");
      setSelectedFiles([]);
      setPatientName("");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };
  

  const handleJobClick = async (fileId) => {
    setSelectedJob(fileId);
    setSelectedTranscript(null);
    setUploadStatus("");
    setEditedTranscript({});

    try {
      const { data } = await axios.get(`${PROGRESS_API_URL}/${fileId}`,{
        withCredentials: true,
      });
      setSelectedTranscript(data.transcript || "No transcript available.");
      setConversationTranscript(data.conversationTranscript || "No conversation transcript available.");
      setTemplateName(data.templateName || "SOAP General Notes");

    } catch (error) {
      console.error("Error fetching transcript:", error);
      setSelectedTranscript("Failed to fetch transcript.");
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const getAccurateDuration = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, 44100);
        
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(audioBuffer.duration);
        } catch (err) {
          reject("Error decoding audio data: " + err);
        }
      };
  
      reader.onerror = () => reject("FileReader error");
      reader.readAsArrayBuffer(blob);
    });
  };
  
  
  
  const handleStopRecording = async () => {
    if (PatientName === "" || Templatevalue === "" ) return;
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      if (audioChunksRef.current.length === 0) return;

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const duration = await getAccurateDuration(audioBlob);
      const fileName = `recording_${Date.now()}.webm`;
      const formData = new FormData();
      formData.append("audioFiles", audioBlob, fileName);
      formData.append("patientName", PatientName);
      formData.append("templateName", Templatevalue);
      formData.append("audioduration", duration);

      setRecording(false);
      audioChunksRef.current = [];

      try {
        const { data } = await axios.post(API_URL, formData,{
          withCredentials: true,
        });
        const minutes = Math.floor(data.usage_limit / 60);
        setremainingMinutes(minutes);
        setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);

      } catch (error) {
        console.error("Error uploading recording:", error);
      }
    };
  };


  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${DELETE_FILE}/${fileId}`, {
        withCredentials: true,
      });
  
      setJobStatuses((prev) => prev.filter((job) => job.fileId !== fileId));
      setSelectedTranscript(null);
      setConversationTranscript(null);
      setTemplateName(null);

      
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  
  

  const convertTime=(seconds)=> {
    if (seconds < 60) return `${seconds} sec`;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = Math.round(seconds % 60);
  
    if (remainingSeconds === 60) {
      remainingSeconds = 0;
    }
  
    let result = [];
  
    if (hours > 0) result.push(`${hours} hr`);
    if (minutes > 0) result.push(`${minutes} min`);
    if (remainingSeconds > 0) result.push(`${remainingSeconds} sec`);
  
    return result.join(" ");
    
  }
      
const handleTranscriptChange = (e, sectionIndex) => {
  const { name, value } = e.target;
  const key = `${sectionIndex}_${name}`;
  setEditedTranscript((prev) => ({
    ...prev,
    [key]: value,
  }));
  setChangedFields((prev) => ({
    ...prev,
    [key]: value, // Track only changed fields
  }));

};

const formatTranscript = (parsedConversationTranscript) => {
  const formattedStrings = [];

  // Iterate over each speaker object
  parsedConversationTranscript.forEach((speakerObj) => {
    Object.entries(speakerObj).forEach(([speaker, sentences]) => {
      sentences.forEach(({ text, startTime, endTime }) => {
        // Format the string and push it to the array
        formattedStrings.push(`${speaker} (${startTime}-${endTime}) => ${text}`);
      });
    });
  });

  return formattedStrings;
};

// Safe JSON parser
const safeJSONParse = (input) => {
  try {
    return typeof input === 'string' ? JSON.parse(input) : input;
  } catch (e) {
    console.error("JSON parse failed:", e);
    return null;
  }
};

// Parse incoming data
const parsedTranscript = safeJSONParse(selectedTranscript);  // Parse selectedTranscript

// Parse and extract sections from transcript
const parseJSONTranscript = (flattenedTranscript) => {
  if (!flattenedTranscript || typeof flattenedTranscript !== 'object') return [];
  const result = [];

  Object.keys(flattenedTranscript).forEach((key) => {
    const match = key.match(/^(\d+)_heading$/);
    if (match) {
      const index = Number(match[1]);
      const heading = flattenedTranscript[`${index}_heading`].trim();
      const text = flattenedTranscript[`${index}_text`]
        ? flattenedTranscript[`${index}_text`].trim()
        : "";
      result.push({ index, heading, text });
    }
  });

  return result.sort((a, b) => a.index - b.index);
};

// Extract unique sections
const uniqueSections = parsedTranscript
  ? Array.from(
      new Map(parseJSONTranscript(parsedTranscript).map(item => [item.index, item])).values()
    )
  : [];

  
  return (
    
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Job Status Section */}
        <div className="lg:w-96 w-full p-4 max-h-screen overflow-y-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div>Remaining Minutes : {(remainingMinutes) ? remainingMinutes : '0'}</div>
      <Box sx={{ typography: "h6",gutterBottom:true }}  className=" sticky top-0 bg-white py-5 z-50">
        Queued Files
      </Box>

      <div className="space-y-2">
        {jobStatuses.length > 0 ? (
          jobStatuses.map((job) => (
            <motion.div
              key={job.fileId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`p-1 relative rounded-lg shadow-lg transition-all duration-300 group 
                ${selectedJob === job.fileId ? "bg-blue-500" : "bg-gray-200"} hover:shadow-lg`}
            >
              <Card className="p-2 shadow-none">
                {job.status === "completed" ? (
                  <>
                    <CardActionArea
                      onClick={() => handleJobClick(job.fileId)}
                      className="p-3 flex flex-col gap-2"
                    ><Box sx={{ typography: "h7",gutterBottom:true }}>Patient Name: </Box>
                        <Box sx={{ typography: "h6",gutterBottom:true }}>{job.PatientName}</Box>
                      <div className="flex items-center gap-3">
                        <ReactAudioPlayer src={`${API_MAIN_URL}/${job.fileName}`} controls />
                      </div>
                      <Box sx={{ typography: "body1"}} className="font-medium">
                      <AccessTime /> {convertTime(job.duration)}
                      </Box>
                      <Box sx={{ typography: "body1"}} className="text-gray-600 ">
                      <Done className="me-2 text-green-600"/>{job.status}
                      </Box>
                    </CardActionArea>

                    {/* Delete button appears only on hover */}
                    <CardActions className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end px-4 pb-3">
                    <Button
        onClick={() => handleOpen(job.fileId)}
        color="error"
        variant="outlined"
        className="rounded-lg"
      >
        <DeleteForever />
      </Button>
      <Button
  onClick={() => handleEditClick(job)}
  color="primary"
  variant="outlined"
  className="rounded-lg mr-2"
>
  <Edit />
</Button>

                    </CardActions>
                  </>
                ) : (
                  <CardContent className="flex items-center gap-3 p-3">
                    <span className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10"></span>
                    <Box sx={{ typography: "body2"}} className="text-gray-600">
                    {job.status}
                    </Box>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))
        ) : (
          <Box sx={{ typography: "body2"}} className="text-gray-500 text-center">
            No queued files yet.
          </Box>
        )}
      </div>
    </div>
    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
  <DialogTitle>Edit Patient Name</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Patient Name"
      type="text"
      fullWidth
      value={editedName}
      onChange={(e) => setEditedName(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditModalOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button
      onClick={handleUpdatePatientName}
      color="primary"
      variant="contained"
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

    <Dialog
        open={openConfirmation}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this transcript? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

        {/* Upload and Record Section */}
        
        <div className="w-full p-4 bg-white shadow-lg rounded-lg max-h-screen overflow-y-auto">
          <div className="text-end me-3">
          <button className="mt-4 me-3">
      <BillingPopup/>
      </button>
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded" style={{cursor:'pointer'}}>
        Logout
      </button></div>
          <Card className="shadow-md rounded-lg sticky top-0 z-50">
            <CardContent>
              <Box sx={{ typography: "h6",fontWeight: "bold",textTransform: 'uppercase',gutterBottom:true }} >Upload & Transcribe</Box>
              <div className="mb-3">
              <TextField
                autoFocus
                name="heading"
                sx={{ "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "18px"} }}
                fullWidth
                value={PatientName}
                onChange={(e) => setPatientName(e.target.value)}
                variant="filled"
                id="filled-basic"
                label="Patient Name"
                className="bg-gray-100 rounded-lg"
              />
             </div>
       
      <FormControl fullWidth variant="outlined">
        <InputLabel id="template-select-label">Template</InputLabel>
          <Select
            labelId="template-select-label"
            label="Template"
            value={Templatevalue}
            onChange={handleChange}
          >
            {templates.map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
      
      </FormControl>

              <div className="flex flex-row gap-2 space-y-2 mt-4">
              <input className="block w-full border border-gray-300 rounded-lg p-2" ref={fileInputRef} type="file" onChange={handleFileChange} />
                <Button variant="contained" color="primary" onClick={handleUpload} className="w-full mx-2">Upload</Button>
                <Button
                  variant="contained"
                  color={recording ? "secondary" : "primary"}
                  onClick={recording ? handleStopRecording : handleStartRecording}
                  className="w-full mx-2"
                >
                  {recording ? <Stop className="mr-2" /> : <Mic className="mr-2" />} {recording ? "Stop Recording" : "Record Audio"}
                </Button>
              </div>
              {uploadStatus && <Box sx={{ typography: "body1"}} align="center" className="text-gray-500 mt-4">{uploadStatus}</Box>}
            </CardContent>
          </Card>

          {/* Transcript Display Section */}
          {transcriptLoading ? (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10"></div>
  </div>
) : (
  
          selectedTranscript && (
  <Card className="p-4 shadow-md rounded-lg">
    <CardContent>
      <Box
        sx={{
          typography: "h6",
          fontWeight: "bold",
          textTransform: "uppercase",
          gutterBottom: true,
          display: "flex",
          marginBottom: "16px",
        }}
      >
        Transcript

        <IconButton onClick={toggleExpandAll} className="text-gray-600 hover:text-gray-800">
          {expandAll ? <Visibility />:<VisibilityOff />}
        </IconButton>
     
      <FormControl fullWidth variant="outlined">
        <InputLabel id="template-fetch-label">Template</InputLabel>
 
          <Select
            labelId="template-fetch-label"
            label="Template"
            value={templateName}
            onChange={handleChangefetched}
          >
            {templates.map((name,index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
      </FormControl>
   
      </Box>
      
      {uniqueSections.map((section) => (
        <Accordion
          key={section.index}
          expanded={expandedIndexes.has(section.index)}
          onChange={() => toggleSingleExpand(section.index)}
          className="mb-4"
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            {editingIndex === section.index ? (
              <TextField
                autoFocus
                name="heading"
                sx={{ "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "18px" } }}
                fullWidth
                value={editedTranscript[`${section.index}_heading`] ?? section.heading}
                onChange={(e) => handleTranscriptChange(e, section.index)}
                onBlur={() => {
                  handleUpdateTranscript();
                  setEditingIndex(null);
                }}
                variant="filled"
                hiddenLabel
                className="mt-2 bg-gray-100 rounded-lg"
              />
            ) : (
              <div
                onDoubleClick={() => setEditingIndex(section.index)}
                className="font-bold text-lg cursor-pointer w-full"
              >
                {editedTranscript[`${section.index}_heading`] ?? section.heading}
              </div>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex justify-between items-center w-full">
              <TextField
                name="text"
                sx={{ "& .MuiInputBase-input": { fontSize: "16px" } }}
                fullWidth
                multiline
                minRows={1}
                value={editedTranscript[`${section.index}_text`] ?? section.text}
                onChange={(e) => handleTranscriptChange(e, section.index)}
                onBlur={handleUpdateTranscript}
                variant="outlined"
                className="mt-2 bg-gray-100 rounded-lg"
              />
              <IconButton
                onClick={() => navigator.clipboard.writeText(section.text)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ContentCopy />
              </IconButton>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </CardContent>
  </Card>
  )
)}
     
 {conversationTranscript && (
  <Card className="p-4 shadow-md rounded-lg">
     <Box
        sx={{
          typography: "h6",
          fontWeight: "bold",
          textTransform: "uppercase",
          gutterBottom: true,
        }}
      >
        CONVERSATION
      </Box>
  <CardContent>
    {formatTranscript(safeJSONParse(conversationTranscript)).map((formattedText, index) => {
      const [speakerTime, text] = formattedText.split('=>');
      return (
        <p key={index}>
          <strong>{speakerTime}:</strong> {text}
        </p>
      );
    })}
  </CardContent>
</Card>


)}


        </div>
      </div>
    
  );
};

export default Dashboard;

