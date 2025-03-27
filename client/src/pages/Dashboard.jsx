import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { Mic, Stop } from "@mui/icons-material";
import { motion } from "framer-motion";


const Dashboard = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [jobStatuses, setJobStatuses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const ROOT_URL = import.meta.env.VITE_API_URL;
const socket = io(ROOT_URL);
  const API_URL = `${ROOT_URL}/api/transcribe`;

  useEffect(() => {
    const handleProgress = (data) => {
      console.log("Received progress update:", data); 
  
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
  
    socket.on("progress", handleProgress);
  
    return () => {
      socket.off("progress", handleProgress);
    };
  }, []); 


  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploadStatus("Uploading and processing...");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("audioFiles", file));

    try {
      const { data } = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);
      setUploadStatus("Upload successful!");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };
  

  const handleJobClick = async (fileId) => {
    setSelectedJob(fileId);
    setSelectedTranscript(null);

    try {
      const { data } = await axios.get(`${PROGRESS_API_URL}/${fileId}`);
      setSelectedTranscript(data.transcript || "No transcript available.");
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
  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      if (audioChunksRef.current.length === 0) return;

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" });
      const fileName = `recording_${Date.now()}.opus`;
      const formData = new FormData();
      formData.append("audioFiles", audioBlob, fileName);

      setRecording(false);
      audioChunksRef.current = [];

      try {
        const { data } = await axios.post(API_URL, formData);
        setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);

      } catch (error) {
        console.error("Error uploading recording:", error);
      }
    };
  };



      
  return (
    <motion.div className="container mx-auto px-6 py-8 h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Job Status Section */}
        <div className="w-full p-4 bg-white shadow-lg rounded-lg max-h-screen overflow-y-auto">
      <Typography variant="h6" gutterBottom className="font-semibold sticky top-0 bg-white py-5">
        Queued Files
      </Typography>

      <Card className="shadow-md rounded-lg">
        <CardContent>
          {jobStatuses.length > 0 ? (
            jobStatuses.map((job) => (
              <motion.div
                key={job.fileId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleJobClick(job.fileId)}
                className={`cursor-pointer p-4 my-2 rounded-lg shadow-sm border ${
                  selectedJob === job.fileId ? "bg-gray-200" : "bg-white"
                }`}
              >
                <Typography variant="body2" className="text-gray-600">
                  {job.status}
                </Typography>

                {/* Show transcript if this job is selected */}
                {selectedJob === job.fileId && (
                  <Card className="p-4 mt-2 shadow-md rounded-lg">
                    <CardContent>
                      <Typography variant="h6" gutterBottom className="font-semibold">
                        Transcript
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        value={job.transcript}
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        className="mt-2 bg-gray-100 rounded-lg"
                      />
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))
          ) : (
            <Typography variant="body2" className="text-gray-500">
              No queued files yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
        {/* Upload and Record Section */}
        <div className="lg:w-96 w-full p-4 max-h-screen overflow-y-auto bg-white shadow-lg rounded-lg">

          <Card className="shadow-md rounded-lg sticky top-0 z-50">
            <CardContent>
              <Typography variant="h6" gutterBottom className="font-semibold">Upload & Transcribe</Typography>
              <input className="block w-full border border-gray-300 rounded-lg p-2" type="file" multiple onChange={handleFileChange} />
              <div className="flex flex-row gap-2 space-y-3 mt-4">
                <Button variant="contained" color="primary" onClick={handleUpload} className="w-full mx-2">Upload & Transcribe</Button>
                <Button
                  variant="contained"
                  color={recording ? "secondary" : "primary"}
                  onClick={recording ? handleStopRecording : handleStartRecording}
                  className="w-full mx-2"
                >
                  {recording ? <Stop className="mr-2" /> : <Mic className="mr-2" />} {recording ? "Stop Recording" : "Record Audio"}
                </Button>
              </div>
              {uploadStatus && <Typography variant="body1" align="center" className="text-gray-500 mt-4">{uploadStatus}</Typography>}
            </CardContent>
          </Card>
         
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

