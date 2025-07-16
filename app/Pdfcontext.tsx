import { createContext, useState } from "react";

//const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

const PdfContext = createContext<{
    selectedPdf: string | null;
    setSelectedPdf: (uri: string | null) => void
}>({
    selectedPdf: null,
    setSelectedPdf: () => {},
});

export default PdfContext;

/*
export const PdfContext = createContext({
     const [selectedPdf, setSelectedPdf] = useState(null)
})*/