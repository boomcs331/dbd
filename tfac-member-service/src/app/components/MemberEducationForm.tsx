import { User, Calendar, School } from 'lucide-react'
import InputField from './InputField'

interface MemberFormData {
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

interface Props {
    formDataEducation: MemberFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}



export default function MemberEducationForm({ formDataEducation, onChange }: Props) {
    console.log(formDataEducation);

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
                    label="ID_NO"
                    type="number"
                    placeholder="ID No"
                    value={formDataEducation.id_no}
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
                value={formDataEducation.active_status}
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
                value={formDataEducation.active_status_name}
                onChange={onChange}
                icon={<User size={18} />}
                disabled
            />

            <InputField
                name="title"
                label="Title"
                placeholder="Title"
                value={formDataEducation.title}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />
            <InputField
                name="member_name"
                label="Member Name"
                placeholder="Member Name"
                value={formDataEducation.member_name}
                onChange={onChange}
                required
                icon={<User size={18} />}
            />



            {/*  <InputField
                name="old_education_id"
                label="Education Old"
                type="select"
                value={formDataEducation.old_education_id}
                onChange={(e) => {
                    onChange(e)
                    const label = educationNameMap[e.target.value] || ''
                    onChange(createFakeEvent('old_education_level', label))
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
                name="old_education_level"
                label="Education Level Old"
                placeholder="Education Level Old"
                value={formDataEducation.old_education_level}
                onChange={onChange}
                disabled
            /> */}


            <InputField
                name="education_id"
                label="Education"
                type="select"
                value={formDataEducation.education_id}
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
                value={formDataEducation.education_level}
                onChange={onChange}
                disabled
            />



            {/*   <InputField
                name="old_college_id"
                label="College Old"
                type="select"
                value={formDataEducation.old_college_id}
                onChange={(e) => {
                    onChange(e)
                    const label = collegeNameMap[e.target.value] || ''
                    onChange(createFakeEvent('old_college_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose College Old
                </option>
                <option value="1">มหาวิทยาลัยบูรพา</option>
                <option value="2">มหาวิทยาลัยกรุงเทพ</option>

            </InputField>

            <InputField
                name="old_college_name"
                label="College Name Old"
                placeholder="College Name Old"
                value={formDataEducation.old_college_name}
                onChange={onChange}
                disabled
            /> */}






            <InputField
                name="college_id"
                label="College"
                type="select"
                value={formDataEducation.college_id}
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
                value={formDataEducation.college_name}
                onChange={onChange}
                disabled
            />



            {/*     <InputField
                name="old_curriculum_id"
                label="Curriculum Old"
                type="select"
                value={formDataEducation.old_curriculum_id}
                onChange={(e) => {
                    onChange(e)
                    const label = curriculumNameMap[e.target.value] || ''
                    onChange(createFakeEvent('old_curriculum_name', label))
                }}
                required
            >
                <option value="" disabled hidden>
                    Choose Curriculum Old
                </option>
                <option value="1">บริหารธุรกิจบัณฑิต</option>
                <option value="2">ธุรกิจบัณฑิต</option>

            </InputField>

            <InputField
                name="old_curriculum_name"
                label="Curriculum Name Old"
                placeholder="Curriculum Name Old"
                value={formDataEducation.old_curriculum_name}
                onChange={onChange}
                disabled
            />
 */}











            <InputField
                name="curriculum_id"
                label="Curriculum"
                type="select"
                value={formDataEducation.curriculum_id}
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
                <option value="2">ธุรกิจบัณฑิต</option>

            </InputField>

            <InputField
                name="curriculum_name"
                label="Curriculum Name"
                placeholder="Curriculum Name"
                value={formDataEducation.curriculum_name}
                onChange={onChange}
                disabled
            />


        </div>
    )
}
