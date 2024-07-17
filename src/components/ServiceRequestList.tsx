import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import {ServiceRequestItem} from "./ServiceRequestItem";
const client = generateClient<Schema>();
function ServiceRequestList() {
    const [serviceRequests, setServiceRequests] = useState<Array<Schema["ServiceRequest"]["type"]>>([]);
    useEffect(() => {
        client.models.ServiceRequest.observeQuery({authMode: 'userPool'}).subscribe({
            next: (data) => setServiceRequests([...data.items]),
        });
    }, []);
    return (
        <div className="w-full p-2 overflow-y-auto overflow-x-hidden">
            {
                serviceRequests.map((serviceRequest,indx) => {
                    return <ServiceRequestItem key={indx} {...serviceRequest}/>
                })
            }
        </div>
    )
}

export { ServiceRequestList }
