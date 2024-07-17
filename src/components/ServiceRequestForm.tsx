import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { ulid } from "ulidx";
import { uploadData } from 'aws-amplify/storage';


function calculateResolutionDate(createdDate: Date, severity: string):Date {
    let rsDate = new Date()
    switch (severity) {
        case "low":
            rsDate.setDate(createdDate.getDate() + 5)
            break;
        case "medium":
            rsDate.setDate(createdDate.getDate() + 3)
            break;
        case "high":
            rsDate.setDate(createdDate.getDate() + 1)
            break;
        default:
            rsDate.setDate(createdDate.getDate() + 5)
            break;
    }
    return rsDate
}

function ServiceRequestForm() {
    const client = generateClient<Schema>();

    const submitServiceRequest = async (e: any) => {
        console.log(e)
        //const { userId} = await getCurrentUser();
        client.models.ServiceRequest.create({
            caseId: ulid(),
            name: e.requestName,
            description: e.description,
            severity: e.severity,
            resolutionDate: calculateResolutionDate(new Date(),e.severity).toISOString().split('T')[0],
            reporterName: e.reporterName,
            contactInfo: e.email,
            location: e.location,
            fileName: e.photo.name,
        }, { authMode: 'userPool' }).then(resp => {
            console.log(resp)
            if (e.photo !== undefined) {
                return uploadData({
                    path: `service-requests/ss/${resp.data?.caseId}/${e.photo.name}`,
                    data: e.photo,
                })
            }
        }).catch(err => {
            console.log(err)
        });

    }
    const formik = useFormik({
        initialValues: {
            requestName: '',
            description: '',
            severity: '',
            reporterName: '',
            email: '',
            location: '',
            photo: '',
        },
        validationSchema: Yup.object({
            requestName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            description: Yup.string()
                .min(15, 'Must be 15 characters or more')
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
            severity: Yup.string()
                .oneOf(["low", "medium", "high"])
                .required('Required'),
            reporterName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            email: Yup.string()
                .email('Must be email')
                .required('Required'),
            location: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            photo: Yup.mixed().required('required')
                .test('fileFormat', 'Only jpg files are allowed', (value) => {
                    if (value) {
                        const supportedFormats = ['jpg'];
                        return supportedFormats.includes((value as File).name?.split('.').pop() || '');
                    }
                    return true;
                })
                .test('fileSize', 'File size must be less than 3MB', value => {
                    if (value) {
                        return (value as File).size <= 3145728;
                    }
                    return true;
                }),
        }),
        onSubmit: submitServiceRequest,
    })

    const handleChange = (e: any) => {
        formik.setFieldValue('photo', e.target.files[0]);
    };

    return (
        <div className="flex border border-gray-900/10 rounded-sm py-12 px-4 shadow min-w-96">
            <form className="flex flex-col w-full" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="requestNname">
                        Request Name
                    </label>
                    <input className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        id="requestName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.requestName}
                    />
                    {
                        formik.touched.requestName && formik.errors.requestName ?
                            (
                                <div className='text-red-400'>{formik.errors.requestName}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        id="description"
                        rows={4}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {
                        formik.touched.description && formik.errors.description ?
                            (
                                <div className='text-red-400'>{formik.errors.description}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="severity">
                        Severity
                    </label>
                    <select
                        id="severity"
                        name="severity"
                        autoComplete="country-name"
                        className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.severity}
                    >
                        <option value={'low'}>low</option>
                        <option value={'medium'}>medium</option>
                        <option value={'high'}>high</option>
                    </select>
                    {
                        formik.touched.severity && formik.errors.severity ?
                            (
                                <div className='text-red-400'>{formik.errors.severity}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="reporterName">
                        Reporter Name
                    </label>
                    <input className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        id="reporterName" type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.reporterName}
                    />
                    {
                        formik.touched.reporterName && formik.errors.reporterName ?
                            (
                                <div className='text-red-400'>{formik.errors.reporterName}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="email">
                        Email
                    </label>
                    <input className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        id="email" type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {
                        formik.touched.email && formik.errors.email ?
                            (
                                <div className='text-red-400'>{formik.errors.email}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="location">
                        Location
                    </label>
                    <input className="flex w-full p-1.5 rounded-md border-0 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600"
                        id="location" type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location}
                    />
                    {
                        formik.touched.location && formik.errors.location ?
                            (
                                <div className='text-red-400'>{formik.errors.location}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <label className="pb-2" htmlFor="photo">
                        photo
                    </label>
                    <input id="photo" type="file" onChange={handleChange} onBlur={formik.handleBlur} />
                    {
                        formik.touched.photo && formik.errors.photo ?
                            (
                                <div className='text-red-400'>{formik.errors.photo}</div>
                            ) : null
                    }
                </div>
                <div className="flex flex-col p-4">
                    <hr className="p-2" />
                    <button className="p-2 rounded-md shadow-sm border border-black hover:bg-black hover:text-white" id="location" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export { ServiceRequestForm }
