'use client';
import React, { useEffect, useState } from 'react';

interface Member {
    id: number;
    first_name: string;
    last_name: string;
    title: string | null;
    member_type_name: string;
    status_name: string;
    education_level: string;
    college_name: string;
    curriculum_name: string;
    registration_date: string;
    expired_date: string;
}

export default function MemberPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/webhook/get-member', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // ส่งพารามิเตอร์ตามที่ API ต้องการ
        })
            .then((res) => res.json())
            .then((data) => {
                setMembers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-black"style={{ textAlign: 'center' ,color: '#a224fa'}}>รายชื่อสมาชิก (DBD)</h1>
            <table className="w-full border border-gray-300 text-black">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">เลขบัตรประชาชน</th>
                        <th className="border px-2 py-1">คำนำหน้า</th>
                        <th className="border px-2 py-1">ชื่อ</th>
                        <th className="border px-2 py-1">สกุล</th>

                        <th className="border px-2 py-1">ประเภท</th>
                        <th className="border px-2 py-1">สถานะ</th>
                        <th className="border px-2 py-1">ระดับการศึกษา</th>
                        <th className="border px-2 py-1">มหาวิทยาลัย</th>
                        <th className="border px-2 py-1">หลักสูตร</th>
                        <th className="border px-2 py-1">วันลงทะเบียน</th>
                        <th className="border px-2 py-1">หมดอายุ</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td className="border px-2 py-1">{member.id}</td>
                            <td className="border px-2 py-1">{member.id_no}</td>
                            <td className="border px-2 py-1">{member.title ?? ''}</td>
                            <td className="border px-2 py-1">{member.first_name} </td>
                            <td className="border px-2 py-1"> {member.last_name}</td>

                            <td className="border px-2 py-1">{member.member_type_name}</td>
                            <td className="border px-2 py-1">{member.status_name}</td>
                            <td className="border px-2 py-1">{member.education_level}</td>
                            <td className="border px-2 py-1">{member.college_name}</td>
                            <td className="border px-2 py-1">{member.curriculum_name}</td>
                            <td className="border px-2 py-1">{member.registration_date}</td>
                            <td className="border px-2 py-1">{member.expired_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
