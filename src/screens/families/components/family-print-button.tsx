'use client'

import {Area, Family, Group, Member} from '@prisma/client'
import {Printer} from 'lucide-react'

import {Button} from '@/components/ui'
import {calculateSao} from '@/lib'

interface FamilyWithDetails extends Family {
  area: Area | null
  group: Group | null
  members: Member[]
}

interface FamilyPrintButtonProps {
  family: FamilyWithDetails
}

export function FamilyPrintButton({family}: FamilyPrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  const currentYear = new Date().getFullYear()
  const members = (family.members || []) as Member[]

  // Fill up to 20 rows to match the "sớ" aesthetic
  const displayRows = [...members]
  while (displayRows.length < 20) {
    displayRows.push({} as Member)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
        <Printer className="h-4 w-4" />
        In Sớ
      </Button>

      {/* Hidden printable area */}
      <div className="hidden print:block print:bg-white print:m-0 print:p-0">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @page {
            size: A4;
            margin: 10mm;
          }
          @media print {
            /* Hide everything by default */
            body * {
              visibility: hidden;
            }
            /* Show only the print container and its children */
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              font-family: 'Times New Roman', serif;
              color: black;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            th, td {
              border: 1px solid black !important;
              padding: 4px 2px;
              text-align: center;
              font-size: 13pt;
              height: 28px;
            }
            .col-name {
              text-align: left !important;
              padding-left: 15px !important;
            }
            .header-text {
              text-align: center;
              font-weight: bold;
              font-size: 18pt;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            .sub-header {
              text-align: center;
              font-size: 12pt;
              line-height: 1.4;
              margin-bottom: 15px;
            }
            .footer-text {
              margin-top: 15px;
              text-align: center;
              font-size: 12pt;
              line-height: 1.4;
            }
          }
        `,
          }}
        />

        <div className="print-container">
          <div className="header-text">NAM MÔ A DI ĐÀ PHẬT</div>

          <div className="sub-header mx-auto max-w-[90%]">
            Tai tín thối độ đầu tú tinh quân, việc tội tiêu trừ kỳ tăng phước thọ, sớ vì{' '}
            {family.area?.address || '..........'}, cư cung tựu, {family.area?.name || '..........'}, trụ phụng Phật tu
            hương thiết cúng tai tin, kỳ an bá tánh kim vì tín chủ.
          </div>

          <table>
            <thead>
              <tr>
                <th className="col-name" style={{width: '40%'}}>
                  Họ tên
                </th>
                <th style={{width: '25%'}}>Sao</th>
                <th style={{width: '15%'}}>Tuổi</th>
                <th style={{width: '20%'}}>Giới tính</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((member, index) => {
                if (!member.id) {
                  return (
                    <tr key={`empty-${index}`}>
                      <td className="col-name">&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  )
                }

                const sao = calculateSao(member.birthYear, member.gender, currentYear) || 'N/A'
                const age = currentYear - member.birthYear + 1

                return (
                  <tr key={member.id}>
                    <td className="col-name uppercase font-bold">{member.fullName}</td>
                    <td>{sao.toUpperCase()}</td>
                    <td>{age}</td>
                    <td>{member.gender === 'MALE' ? 'NAM' : 'NỮ'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="footer-text mx-auto max-w-[90%]">
            Hiệp gia quyến tín chủ đại tiểu đẳng tức nhựt phần hương tâm thành khấu bái thánh ân chứng minh vĩ văn cẩn
            sớ tề thứ {currentYear} niên phụng vì tín chủ khấu bái thượng sớ.
          </div>
        </div>
      </div>
    </>
  )
}
