import { User } from 'lucide-react'
import InputField from './InputField'

interface FormData {
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

interface Props {
    formDataStatusChange: FormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const statusOptions = [
    { value: '1', label: 'คงอยู่' },
    { value: '2', label: 'สิ้นผล' },
    { value: '4', label: 'ยกเลิก' },
]

const statusNameMap: Record<string, string> = {
    '1': 'คงอยู่',
    '2': 'สิ้นผล',
    '4': 'ยกเลิก',
}

export default function MemberStatusChangedForm({ formDataStatusChange, onChange }: Props) {
    const createFakeEvent = (name: string, value: string) =>
    ({
        target: { name, value },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="md:col-span-2">
                <InputField
                    name="id_no"
                    label="ID_NO"
                    type="number"
                    placeholder="ID No"
                    value={formDataStatusChange.id_no}
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
                value={formDataStatusChange.active_status}
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
                value={formDataStatusChange.active_status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            />





            <InputField
                name="title"
                label="Title"
                placeholder="Title"
                value={formDataStatusChange.title}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />

            <InputField
                name="member_name"
                label="Name"
                placeholder="Member Name"
                value={formDataStatusChange.member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />

           {/*  <InputField
                name="old_status"
                label="Old Status"
                type="select"
                placeholder="Old Status"
                value={formDataStatusChange.old_status}
                onChange={(e) => {
                    onChange(e)
                    const label = statusNameMap[e.target.value] || ''
                    onChange(createFakeEvent('old_status_name', label))
                }}
                options={statusOptions}
                required
                icon={<User size={18} />}
            />

            <InputField
                name="old_status_name"
                label="Old Status Name"
                placeholder="Old Status Name"
                value={formDataStatusChange.old_status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            /> */}

            <InputField
                name="status"
                label="Status"
                type="select"
                placeholder="Status"
                value={formDataStatusChange.status}
                onChange={(e) => {
                    onChange(e)
                    const label = statusNameMap[e.target.value] || ''
                    onChange(createFakeEvent('status_name', label))
                }}
                options={statusOptions}
                required
                icon={<User size={18} />}
            />

            <InputField
                name="status_name"
                label="Status Name"
                placeholder="Status Name"
                value={formDataStatusChange.status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            />
        </div>
    )
}
