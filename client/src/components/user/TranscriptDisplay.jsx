import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { ContentCopy, ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * TranscriptDisplay Component
 * 
 * Props:
 * - transcriptLoading: boolean
 * - selectedTranscript: object
 * - expandAll: boolean
 * - toggleExpandAll: function
 * - expandedIndexes: Set
 * - toggleSingleExpand: function(index)
 * - templateName: string
 * - handleChangefetched: function (for template select)
 * - templates: array of template names
 * - uniqueSections: array of { index, heading, text }
 * - editingIndex: number | null
 * - editedTranscript: object
 * - handleTranscriptChange: function
 * - handleUpdateTranscript: function
 * - conversationTranscript: JSON string or object
 * - formatTranscript: function
 * - safeJSONParse: function
 * - setEditingIndex: function
 */
const TranscriptDisplay = ({
  transcriptLoading,
  selectedTranscript,
  expandAll,
  toggleExpandAll,
  expandedIndexes,
  toggleSingleExpand,
  templateName,
  handleChangefetched,
  templates,
  uniqueSections,
  editingIndex,
  editedTranscript,
  handleTranscriptChange,
  handleUpdateTranscript,
  conversationTranscript,
  formatTranscript,
  safeJSONParse,
  setEditingIndex
}) => {
  return (
    <>
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
                  marginBottom: "16px"
                }}
              >
                Transcript
                <IconButton
                  onClick={toggleExpandAll}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {expandAll ? <Visibility /> : <VisibilityOff />}
                </IconButton>

                <FormControl fullWidth variant="outlined">
                  <InputLabel id="template-fetch-label">Template</InputLabel>
                  <Select
                    labelId="template-fetch-label"
                    label="Template"
                    value={templateName}
                    onChange={handleChangefetched}
                  >
                    {templates.map((name, index) => (
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
                        sx={{
                          "& .MuiInputBase-input": {
                            fontWeight: "bold",
                            fontSize: "18px"
                          }
                        }}
                        fullWidth
                        value={
                          editedTranscript[`${section.index}_heading`] ??
                          section.heading
                        }
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
                        {editedTranscript[`${section.index}_heading`] ??
                          section.heading}
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
                        value={
                          editedTranscript[`${section.index}_text`] ??
                          section.text
                        }
                        onChange={(e) =>
                          handleTranscriptChange(e, section.index)
                        }
                        onBlur={handleUpdateTranscript}
                        variant="outlined"
                        className="mt-2 bg-gray-100 rounded-lg"
                      />
                      <IconButton
                        onClick={() =>
                          navigator.clipboard.writeText(section.text)
                        }
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
              gutterBottom: true
            }}
          >
            CONVERSATION
          </Box>
          <CardContent>
            {formatTranscript(safeJSONParse(conversationTranscript)).map(
              (formattedText, index) => {
                const [speakerTime, text] = formattedText.split("=>");
                return (
                  <p key={index}>
                    <strong>{speakerTime}:</strong> {text}
                  </p>
                );
              }
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TranscriptDisplay;
