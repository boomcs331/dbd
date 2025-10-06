import { User, Calendar, School } from 'lucide-react'
import InputField from './InputField'

interface MemberFormData {
    id_no: string
    title: string
    member_name: string
    expired_date: string
    old_expired_date: string
    active_status: string
    active_status_name: string

}

const statusNameMap: Record<string, string> = {
    '1': 'คงอยู่',
    '2': 'สิ้นผล',
    '4': 'ยกเลิก',
}

const statusOptions = [
    { value: '1', label: 'คงอยู่' },
    { value: '2', label: 'สิ้นผล' },
    { value: '4', label: 'ยกเลิก' },
]

const createFakeEvent = (name: string, value: string) =>
({
    target: { name, value },
} as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)

interface Props {
    formDataRenewalChange: MemberFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function MemberRenewalForm({ formDataRenewalChange, onChange }: Props) {
    console.log(formDataRenewalChange);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="md:col-span-2">
                <InputField
                    name="id_no"
                    label="ID_NO"
                    type="number"
                    placeholder="ID No"
                    value={formDataRenewalChange.id_no}
                    onChange={onChange}
                    required
                    icon={<User size={18} />}
                />
            </div>



            <InputField
                name="active_status"
                label="Active Status"
                type="select"
                placeholder="Old Status"
                value={formDataRenewalChange.active_status}
                onChange={(e) => {
                    onChange(e)
                    const label = statusNameMap[e.target.value] || ''
                    onChange(createFakeEvent('active_status_name', label))
                }}
                options={statusOptions}
                required
                icon={<User size={18} />}
            />

            <InputField
                name="active_status_name"
                label="Active Status Name"
                placeholder="Old Status Name"
                value={formDataRenewalChange.active_status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            />

            <InputField
                name="title"
                label="Title"
                placeholder="Title"
                value={formDataRenewalChange.title}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />
            <InputField
                name="member_name"
                label="Member Name"
                placeholder="Member Name"
                value={formDataRenewalChange.member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />




            {/*             <InputField
                name="old_expired_date"
                label="Expired Date"
                type="date"
                value={formDataRenewalChange.old_expired_date}
                onChange={onChange}
                icon={<Calendar size={18} />}
            /> */}
            <div className="md:col-span-2">
                <InputField
                    name="expired_date"
                    label="New Expired Date"
                    type="date"
                    value={formDataRenewalChange.expired_date}
                    onChange={onChange}
                    icon={<Calendar size={18} />}
                />
            </div>
        </div>
    )
}
