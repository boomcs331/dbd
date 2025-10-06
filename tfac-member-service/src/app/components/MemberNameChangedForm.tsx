import { User, Calendar, School } from 'lucide-react'
import InputField from './InputField'

interface MemberFormData {
    id_no: string
    title: string
    member_name: string
    old_member_name: string
    active_status: string
    active_status_name: string
}

interface Props {
    formDataNameChanged: MemberFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function MemberNameChangedForm({ formDataNameChanged, onChange }: Props) {
    console.log(formDataNameChanged);

    const memberTypeNameMap: Record<string, string> = {
        '1': 'สามัญ',
        '2': 'วิสามัญ',
        '3': 'สมทบ',
    }

    const statusNameMap: Record<string, string> = {
        '1': 'คงอยู่',
        '2': 'สิ้นผล',
        '4': 'ยกเลิก',
    }

    const educationNameMap: Record<string, string> = {
        '1': 'กำลังศึกษา',
        '2': 'สำเร็จการศึกษา',
    }
    const collegeNameMap: Record<string, string> = {
        '1': 'มหาวิทยาลัยบูรพา',
        '2': 'มหาวิทยาลัยกรุงเทพ',
    }
    const curriculumNameMap: Record<string, string> = {
        '1': 'บริหารธุรกิจบัณฑิต',
        '2': 'ธุรกิจบัณฑิต'
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

            <div className="md:col-span-2">
                <InputField
                    name="id_no"
                    label="ID No"
                    type="number"
                    placeholder="ID No"
                    value={formDataNameChanged.id_no}
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
                value={formDataNameChanged.active_status}
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
                value={formDataNameChanged.active_status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            />



            <InputField
                name="title"
                label="Title"
                placeholder="Title"
                value={formDataNameChanged.title}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />

            <InputField
                name="member_name"
                label="Member Name"
                placeholder="Member Name"
                value={formDataNameChanged.member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />
            {/*  <InputField
                name="old_member_name"
                label="Member Name Old"
                placeholder="Member Name Old"
                value={formDataNameChanged.old_member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />
 */}



        </div>
    )
}
