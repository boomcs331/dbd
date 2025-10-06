'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import MemberRegisteredForm from './MemberRegisteredForm'
import MemberStatusChangedForm from './MemberStatusChangedForm'
import MemberRenewalForm from './MemberRenewalForm'
import MemberEducationForm from './MemberEducationForm'
import MemberTypeChangedForm from './MemberTypeChangedForm'
import MemberNameChangedForm from './MemberNameChangedForm'


import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type EventType = 'MEMBER_REGISTERED' | 'MEMBER_STATUS_CHANGED' | 'MEMBER_RENEWAL' | 'MEMBER_EDUCATION_UPDATED' | 'MEMBER_TYPE_CHANGED' | 'MEMBER_NAME_CHANGED'

interface MemberRegisteredData {
    id_no: string
    title: string
    member_name: string
    member_type: string
    member_type_name: string
    expired_date: string
    status: string
    status_name: string
    registration_date: string
    education_id: string
    education_level: string
    college_id: string
    college_name: string
    curriculum_id: string
    curriculum_name: string
}

interface MemberStatusChangedData {
    id_no: string
    title: string
    member_name: string
    old_status: string
    old_status_name: string
    status: string
    status_name: string
    active_status: string
    active_status_name: string
}

interface MemberRenewalChangedData {
    id_no: string
    title: string
    member_name: string
    old_expired_date: string
    expired_date: string
    active_status: string
    active_status_name: string
}

interface MemberEducationChangedData {
    id_no: string
    title: string
    member_name: string
    old_education_id: string
    old_education_level: string
    old_college_id: string
    old_college_name: string
    old_curriculum_id: string
    old_curriculum_name: string
    education_id: string
    education_level: string
    college_id: string
    college_name: string
    curriculum_id: string
    curriculum_name: string
    active_status: string
    active_status_name: string
}

interface MemberTypeChangedData {
    id_no: string
    title: string
    member_name: string
    old_member_type: string
    old_member_type_name: string
    member_type: string
    member_type_name: string
    active_status: string
    active_status_name: string
}

interface MemberNameChangedData {
    id_no: string
    title: string
    member_name: string
    old_member_name: string
    active_status: string
    active_status_name: string
}

const defaultRegisteredData: MemberRegisteredData = {
    id_no: '6016114915151',
    title: 'นางสาว',
    member_name: 'สมทรง รักบัญชี',
    member_type: '1',
    member_type_name: 'สามัญ',
    expired_date: '2025-12-31',
    status: '1',
    status_name: 'คงอยู่',
    registration_date: '2015-05-14',
    education_id: '1',
    education_level: 'กำลังศึกษา',
    college_id: '1',
    college_name: 'มหาวิทยาลัยบูรพา',
    curriculum_id: '1',
    curriculum_name: 'บริหารธุรกิจบัณฑิต',
}

const defaultStatusChangedData: MemberStatusChangedData = {
    id_no: '6016114915151',
    title: 'นางสาว',
    member_name: 'สมทรง รักบัญชี',
    old_status: '1',
    old_status_name: 'คงอยู่',
    status: '4',
    status_name: 'ยกเลิก',
    active_status: "1",
    active_status_name: "คงอยู่"

}

const defaultRenewalChangedData: MemberRenewalChangedData = {
    id_no: '6016114915151',
    title: 'นางสาว',
    member_name: 'สมทรง รักบัญชี',
    old_expired_date: '1990-01-01',
    expired_date: '2025-12-31',
    active_status: "1",
    active_status_name: "คงอยู่"



}

const defaultEducationChangedData: MemberEducationChangedData = {
    id_no: "6016114915151",
    title: "นางสาว",
    member_name: "สมทรง รักบัญชี",
    old_education_id: "1",
    old_education_level: "กำลังศึกษา",

    old_college_id: "1",
    old_college_name: "มหาวิทยาลัยบูรพา",

    old_curriculum_id: "1",
    old_curriculum_name: "บริหารธุรกิจบัณฑิต",

    education_id: "2",
    education_level: "สำเร็จการศึกษา",

    college_id: "2",
    college_name: "มหาวิทยาลัยกรุงเทพ",

    curriculum_id: "2",
    curriculum_name: "ธุรกิจบัณฑิต",
    active_status: "1",
    active_status_name: "คงอยู่"
    

}

const defaultTypeChangedData: MemberTypeChangedData = {
    id_no: "6016114915151",
    title: "นางสาว",
    member_name: "สมทรง รักบัญชี",
    old_member_type: "1",
    old_member_type_name: "สามัญ",
    member_type: "2",
    member_type_name: "วิสามัญ",
    active_status: "1",
    active_status_name: "คงอยู่"


}

const defaultNameChangedData: MemberNameChangedData = {
    id_no: "6016114915151",
    title: "นางสาว",
    member_name: "สมทรง รักบัญชี",
    old_member_name: "สมหญิง รักบัญชี",
    active_status: "1",
    active_status_name: "คงอยู่"


}


export default function EventForm() {
    const [eventType, setEventType] = useState<EventType | ''>('')
    const [formData, setFormData] = useState<MemberRegisteredData | MemberStatusChangedData | MemberRenewalChangedData | MemberEducationChangedData | MemberTypeChangedData | MemberNameChangedData>({} as any)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (eventType === 'MEMBER_REGISTERED') {
            setFormData(defaultRegisteredData)
        } else if (eventType === 'MEMBER_STATUS_CHANGED') {
            setFormData(defaultStatusChangedData)
        } else if (eventType === 'MEMBER_RENEWAL') {
            setFormData(defaultRenewalChangedData)
        } else if (eventType === 'MEMBER_EDUCATION_UPDATED') {
            setFormData(defaultEducationChangedData)
        } else if (eventType === 'MEMBER_TYPE_CHANGED') {
            setFormData(defaultTypeChangedData)
        }
        else if (eventType === 'MEMBER_NAME_CHANGED') {
            setFormData(defaultNameChangedData)
        } else {
            setFormData({} as any)
        }
    }, [eventType])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const getFormattedDate = (): string => {
        const pad = (n: number) => n.toString().padStart(2, '0')
        const now = new Date()
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!eventType) {
            toast.error('กรุณาเลือก Event Type')
            setLoading(false)
            return
        }

        const payload = {
            ...formData,
            event_type: eventType,
            routingKey: 'webhook_queue',
            rabbitmq_id: `msg-${Math.random().toString(36).substring(2, 10)}`,
            received_at: getFormattedDate(),
        }

        console.log('🔹 ส่งข้อมูล:', payload)

        try {
            const res = await axios.post('http://localhost:3000/event/member-update', payload)
            console.log('✅ API Response:', res.data)

            toast.success(`✅ ส่งข้อมูลสำเร็จ: ${res.data.message || 'บันทึกข้อมูลเรียบร้อย'}`)
            setFormData(eventType === 'MEMBER_REGISTERED' ? defaultRegisteredData : defaultStatusChangedData)
            setEventType('')
        } catch (err: any) {
            console.error('❌ API Error:', err)
            toast.error(`❌ ส่งข้อมูลล้มเหลว: ${err.response?.data?.message || err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded shadow-md">
                <label className="block font-semibold text-gray-700">
                    Event Type:
                    <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventType)}
                        className="ml-2 mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- เลือก --</option>
                        <option value="MEMBER_REGISTERED">MEMBER_REGISTERED</option>
                        <option value="MEMBER_STATUS_CHANGED">MEMBER_STATUS_CHANGED</option>
                        <option value="MEMBER_RENEWAL">MEMBER_RENEWAL</option>
                        <option value="MEMBER_EDUCATION_UPDATED">MEMBER_EDUCATION_UPDATED</option>
                        <option value="MEMBER_TYPE_CHANGED">MEMBER_TYPE_CHANGED</option>
                        <option value="MEMBER_NAME_CHANGED">MEMBER_NAME_CHANGED</option>
                    </select>
                </label>

                {eventType === 'MEMBER_REGISTERED' && (
                    <MemberRegisteredForm formData={formData as MemberRegisteredData} onChange={handleChange} />
                )}
                {eventType === 'MEMBER_STATUS_CHANGED' && (
                    <MemberStatusChangedForm formDataStatusChange={formData as MemberStatusChangedData} onChange={handleChange} />
                )}
                {eventType === 'MEMBER_RENEWAL' && (
                    <MemberRenewalForm formDataRenewalChange={formData as MemberRenewalChangedData} onChange={handleChange} />
                )}
                {eventType === 'MEMBER_EDUCATION_UPDATED' && (
                    <MemberEducationForm formDataEducation={formData as MemberEducationChangedData} onChange={handleChange} />
                )}
                {eventType === 'MEMBER_TYPE_CHANGED' && (
                    <MemberTypeChangedForm formDataTypeChanged={formData as MemberTypeChangedData} onChange={handleChange} />
                )}
                {eventType === 'MEMBER_NAME_CHANGED' && (
                    <MemberNameChangedForm formDataNameChanged={formData as MemberNameChangedData} onChange={handleChange} />
                )}


                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md text-white font-semibold ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                >
                    {loading ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล'}
                </button>
            </form>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
        </>
    )
}
