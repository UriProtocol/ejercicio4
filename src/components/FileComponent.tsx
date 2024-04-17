import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { IoArrowForward, IoArrowBack } from 'react-icons/io5'

export default function FileComponent({ doc, docName = 'file', download, color }: { doc: string, docName?: string, download?: boolean, color: string }) {

    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const getFileType = (url: string) => {
        if (url.includes('openxmlformats-officedocument.wordprocessingml.document')) {
            return 'word';
        } else if (url.includes('.pdf')) {
            return 'pdf';
        } else {
            const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'svg', 'webp'];
            const extensionMatch = url.match(/\.([0-9a-zA-Z]+)(?=\?|$)/);
            const extension = extensionMatch ? extensionMatch[1].toLowerCase() : null;
            if (imageExtensions.includes(extension || "")) {
                return 'image';
            }
        }

        console.log(url)

        return 'unknown';
    };

    const [downloadUrl, setDownloadUrl] = useState('')
    const [fileName, setFileName] = useState('')

    function getPdfBlob(url: string) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const contentType = blob.type;
                const fileType = contentType.split('/')[1];
                const newUrl = window.URL.createObjectURL(new Blob([blob]));
                const fileName = `${docName}.${fileType}`
                setDownloadUrl(newUrl)
                setFileName(fileName)

            })
            .catch(error => console.error('Error downloading PDF:', error));
    };

    useEffect(() => {
        if (!download) return
        getPdfBlob(doc)
    }, [doc])

    const fileType = getFileType(doc);


    return (
        <div className="flex">
            {fileType === "pdf" && (
                <Document file={doc} onLoadSuccess={onDocumentLoadSuccess} >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    //customTextRenderer={false}
                    />
                    <div className=' flex items-start flex-col my-4 gap-4'>
                        <div className=' flex justify-start items-center gap-4'>
                            {
                                pageNumber > 1 ? (
                                    <IoArrowBack className='mr-2s cursor-pointer' onClick={() => setPageNumber(pageNumber - 1)} />
                                ) : null
                            }
                            <p className=' text-start'>
                                Page {pageNumber} of {numPages}
                            </p>
                            {
                                pageNumber < 2 || numPages > 2 && pageNumber < numPages ? (
                                    <IoArrowForward className='mr-auto cursor-pointer' onClick={() => setPageNumber(pageNumber + 1)} />
                                ) : null
                            }
                        </div>
                        {
                            download ? (
                                <a className='link mb-4' href={downloadUrl} download={fileName} target='_blank'>Download</a>
                            ) : null
                        }
                    </div>
                </Document>
            )}
            {fileType === "word" && (
                <iframe src={doc}></iframe>
            )}

            {doc && fileType === "image" || fileType == 'unknown' && (
                <div className='w-full rounded py-4' style={{backgroundColor: color ? color : "rgb(63,63,60)"}}>
                    <img className='max-h-32 mx-auto shadow rounded' src={doc} />
                </div>
            )}
            {
                download && fileType !== 'pdf' ? (
                    <a className='link mt-2' href={downloadUrl} download={fileName} target='_blank'>Download</a>
                ) : null
            }
        </div>
    )
}
