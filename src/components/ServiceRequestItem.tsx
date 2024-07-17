import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { remove, getUrl } from 'aws-amplify/storage';
import { useState, useEffect } from "react";

export const DefaultStorageImageExample = () => {
    return
};
const client = generateClient<Schema>();
function ServiceRequestItem({ id, caseId, name, severity, createdAt, fileName, reporterName, resolutionDate, location, contactInfo }: Schema["ServiceRequest"]["type"]) {
    const [photoURL, setPhotoURL] = useState<string>('');
    useEffect(() => {
        getUrl({
            path: `service-requests/ss/${caseId}/${fileName}`,
            options: {
                validateObjectExistence: true,  // defaults to false
                expiresIn: 300, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
            },
        }).then(resp => {
            setPhotoURL(resp.url.toString())
        })
            .catch(err => {
                console.log(err)
            })
    }, [])


    function deleteServiceRequest(id: string) {
        client.models.ServiceRequest.delete({ id }, { authMode: 'userPool' })
            .then(res => {
                return remove({ path: `service-requests/ss/${caseId}/${fileName}` })
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="flex flex-col w-full border shadow-md m-1">
            <div className="w-full flex justify-end p-2 border-b">
                <button className="py-1 px-2 border border-red-800 text-red-800 rounded" onClick={() => deleteServiceRequest(id)}> X </button>
            </div>
            <div className="flex w-full ">
                <div className="flex flex-wrap w-1/2 xl:w-5/6 p-2">
                    <div className="p-2 min-w-96">
                        <span className="p-1">Case Id</span>
                        <span className="p-1">{caseId}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">Request Name</span>
                        <span className="p-1">{name}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">Severity</span>
                        <span className="p-1">{severity}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">created at</span>
                        <span className="p-1">{createdAt}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">ResolutionDate</span>
                        <span className="p-1">{resolutionDate}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">Reporter Name</span>
                        <span className="p-1">{reporterName}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">Contact Info</span>
                        <span className="p-1">{contactInfo}</span>
                    </div>
                    <div className="p-2 min-w-96">
                        <span className="p-1">Location</span>
                        <span className="p-1">{location}</span>
                    </div>
                </div>
                <div className="flex w-1/2 xl:w-1/6 p-2 justify-end">

                    <img className="w-56" src={photoURL} />
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export { ServiceRequestItem }
