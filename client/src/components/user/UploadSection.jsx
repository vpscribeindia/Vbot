import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Mic, Stop } from "@mui/icons-material";

/**
 * UploadSection Component
 * 
 * Props:
 * - PatientName: string
 * - setPatientName: function
 * - templates: array of template names
 * - Templatevalue: string (selected template)
 * - handleChange: function for template select
 * - fileInputRef: ref to file input
 * - handleFileChange: function for file input
 * - handleUpload: function for upload button
 * - recording: boolean (recording state)
 * - handleStartRecording: function
 * - handleStopRecording: function
 * - uploadStatus: string (status message)
 */
const UploadSection = ({
  PatientName,
  setPatientName,
  templates,
  Templatevalue,
  handleChange,
  fileInputRef,
  handleFileChange,
  handleUpload,
  recording,
  handleStartRecording,
  handleStopRecording,
  uploadStatus
}) => {
  return (
    <Card className="mt-14 shadow-md rounded-lg sticky top-14 z-10">
      <CardContent>
        {/* Title */}
        <Box sx={{ typography: "h6", fontWeight: "bold", textTransform: "uppercase", gutterBottom: true }}>
          Upload & Transcribe
        </Box>

        {/* Patient Name */}
        <div className="mb-3">
          <TextField
            autoFocus
            name="heading"
            sx={{ "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "18px" } }}
            fullWidth
            value={PatientName}
            onChange={(e) => setPatientName(e.target.value)}
            variant="filled"
            id="filled-basic"
            label="Patient Name"
            className="bg-gray-100 rounded-lg"
          />
        </div>

        {/* Template Select */}
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

        {/* File Upload + Buttons */}
        <div className="flex flex-row gap-2 space-y-2 mt-4">
          <input
            className="block w-full border border-gray-300 rounded-lg p-2"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            className="w-full mx-2"
          >
            Upload
          </Button>
          <Button
            variant="contained"
            color={recording ? "secondary" : "primary"}
            onClick={recording ? handleStopRecording : handleStartRecording}
            className="w-full mx-2"
          >
            {recording ? <Stop className="mr-2" /> : <Mic className="mr-2" />}
            {recording ? "Stop Recording" : "Record Audio"}
          </Button>
        </div>

        {/* Status Message */}
        {uploadStatus && (
          <Box sx={{ typography: "body1" }} align="center" className="text-gray-500 mt-4">
            {uploadStatus}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadSection;
