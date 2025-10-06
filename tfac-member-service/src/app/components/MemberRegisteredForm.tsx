import { User, Calendar, School } from 'lucide-react'
import InputField from './InputField'

interface MemberFormData {
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

interface Props {
    formData: MemberFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function MemberRegisteredForm({ formData, onChange }: Props) {
    console.log(formData);

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
    }

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
                    value={formData.id_no}
                    onChange={onChange}
                    required
                    icon={<User size={18} />}
                />
            </div>
            <InputField
                name="title"
                label="Title"
                placeholder="Title"
                value={formData.title}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />
            <InputField
                name="member_name"
                label="Member Name"
                placeholder="Member Name"
                value={formData.member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />

            {/* Member Type */}
            <InputField
                name="member_type"
                label="Member Type"
                type="select"
                value={formData.member_type}
                onChange={(e) => {
                    onChange(e)
                    const label = memberTypeNameMap[e.target.value] || ''
                    onChange(createFakeEvent('member_type_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose member type
                </option>
                <option value="1">สามัญ</option>
                <option value="2">วิสามัญ</option>
                <option value="3">สมทบ</option>
            </InputField>

            <InputField
                name="member_type_name"
                label="Member Type Name"
                placeholder="Member Type Name"
                value={formData.member_type_name}
                onChange={onChange}
                disabled
            />

            <InputField
                name="expired_date"
                label="Expired Date"
                type="date"
                value={formData.expired_date}
                onChange={onChange}
                icon={<Calendar size={18} />}
            />
            <InputField
                name="registration_date"
                label="Registration Date"
                type="date"
                value={formData.registration_date}
                onChange={onChange}
                icon={<Calendar size={18} />}
            />


            {/* Status */}
            <InputField
                name="status"
                label="Status"
                type="select"
                value={formData.status}
                onChange={(e) => {
                    onChange(e)
                    const label = statusNameMap[e.target.value] || ''
                    onChange(createFakeEvent('status_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose status
                </option>
                <option value="1">คงอยู่</option>
                <option value="2">สิ้นผล</option>
                <option value="4">ยกเลิก</option>
            </InputField>

            <InputField
                name="status_name"
                label="Status Name"
                placeholder="Status Name"
                value={formData.status_name}
                onChange={onChange}
                disabled
            />




            <InputField
                name="education_id"
                label="Education"
                type="select"
                value={formData.education_id}
                onChange={(e) => {
                    onChange(e)
                    const label = educationNameMap[e.target.value] || ''
                    onChange(createFakeEvent('education_level', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose education
                </option>
                <option value="1">กำลังศึกษา</option>
                <option value="2">สำเร็จการศึกษา</option>

            </InputField>

            <InputField
                name="education_level"
                label="Education Level"
                placeholder="Education Level"
                value={formData.education_level}
                onChange={onChange}
                disabled
            />



            <InputField
                name="college_id"
                label="College"
                type="select"
                value={formData.college_id}
                onChange={(e) => {
                    onChange(e)
                    const label = collegeNameMap[e.target.value] || ''
                    onChange(createFakeEvent('college_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose College
                </option>
                <option value="1">มหาวิทยาลัยบูรพา</option>
                <option value="2">มหาวิทยาลัยกรุงเทพ</option>

            </InputField>

            <InputField
                name="college_name"
                label="College Name"
                placeholder="College Name"
                value={formData.college_name}
                onChange={onChange}
                disabled
            />



            <InputField
                name="curriculum_id"
                label="Curriculum"
                type="select"
                value={formData.curriculum_id}
                onChange={(e) => {
                    onChange(e)
                    const label = curriculumNameMap[e.target.value] || ''
                    onChange(createFakeEvent('curriculum_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose Curriculum
                </option>
                <option value="1">บริหารธุรกิจบัณฑิต</option>

            </InputField>

            <InputField
                name="curriculum_name"
                label="Curriculum Name"
                placeholder="Curriculum Name"
                value={formData.curriculum_name}
                onChange={onChange}
                disabled
            />


        </div>
    )
}
