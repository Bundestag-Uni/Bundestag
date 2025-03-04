import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CollapsibleTable() {
    const [reden, setReden] = useState([]);

    useEffect(() => {
        fetchReden();
    }, []);

    async function fetchReden() {
        try {
            const response = await fetch("/api/pgapi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ queryType: "getRedenWithMeta" })
            });
            const data = await response.json();

            const mappedReden = data.map((item) => ({
                id: item.id,
                redner: `${item.vorname} ${item.nachname}`,
                partei: item.partei_kurz,
                datum: item.datum,
                inhalt: item.inhalt
            }));

            setReden(mappedReden);
        } catch (err) {
            console.error("Fehler beim Abrufen der Reden:", err);
        }
    }

    return (
        <>
            <Header />
            <Navbar />
            <h1 style={{ "textAlign": "center", "margin": "10px" }}>Reden im Bundestag<span style={{ "fontSize": "14px", "fontWeight": "lighter" }}>Mit KI-Zusammenfassung</span></h1>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>ID</TableCell>
                            <TableCell>Redner</TableCell>
                            <TableCell>Partei</TableCell>
                            <TableCell>Datum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reden.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Footer />
        </>
    );
}


function Row({ row }) {
    const [open, setOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        try {
            setLoading(true);
            setSummary("");

            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: row.inhalt })
            });
            const data = await response.json();
            if (data.summary) {
                setSummary(data.summary);
            } else {
                setSummary("Fehler: Keine Zusammenfassung erhalten.");
            }
        } catch (error) {
            console.error("Fehler beim Zusammenfassen:", error);
            setSummary("Fehler beim Zusammenfassen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hauptzeile */}
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.redner}</TableCell>
                <TableCell>{row.partei}</TableCell>
                <TableCell>{row.datum}</TableCell>
            </TableRow>

            {/* Ausklappbare Detail-Zeile */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom>
                                Voller Rede-Text
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {row.inhalt}
                            </Typography>

                            {/* Button für Zusammenfassung */}
                            <Button variant="contained" onClick={handleSummarize}>
                                {loading ? "Bitte warten..." : "Zusammenfassen"}
                            </Button>

                            {/* KI-Zusammenfassung anzeigen */}
                            {summary && (
                                <Box mt={2} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}>
                                    <Typography variant="subtitle2">Zusammenfassung:</Typography>
                                    <Typography variant="body2">{summary}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        redner: PropTypes.string.isRequired,
        partei: PropTypes.string.isRequired,
        datum: PropTypes.string.isRequired,
        inhalt: PropTypes.string.isRequired
    }).isRequired
};
