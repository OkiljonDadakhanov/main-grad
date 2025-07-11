"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16">
      <div className="max-w-4xl w-full">
        <Card className="bg-white text-black shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-sm md:text-base leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                University Offer Letter — Communication Policy
              </h2>
              <p className="font-medium mb-1">
                (For Universities using gradabroad.net platform)
              </p>
              <p className="mb-2 font-semibold">Clause: Exclusive Communication via gradabroad.net</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  By registering on and using the gradabroad.net platform, the university agrees to the following:
                </li>
                <li>
                  The university shall only communicate with students who apply through the gradabroad.net platform via the platform itself.
                </li>
                <li>
                  The university shall not use any external communication channels (e.g., personal email, phone, or other websites) to contact or respond to these students outside the platform.
                </li>
                <li>
                  If a student attempts to contact the university via other means (e.g., email or messenger apps), the university must politely redirect the student to communicate only through gradabroad.net, explaining that all official correspondence is handled through the platform.
                </li>
                <li>
                  This policy ensures transparency, accountability, and data protection in all admission-related interactions.
                </li>
                <li>
                  By accepting this offer, the university confirms its commitment to the above communication protocol.
                </li>
              </ul>
            </div>

            <hr className="border-t border-gray-300" />

            <div>
              <h2 className="text-lg font-semibold mb-2">
                대학용 오퍼서 — 커뮤니케이션 정책
              </h2>
              <p className="font-medium mb-1">
                (gradabroad.net 플랫폼을 이용하는 대학을 위한)
              </p>
              <p className="mb-2 font-semibold">조항: gradabroad.net을 통한 전용 소통 원칙</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  gradabroad.net 플랫폼에 등록하고 사용하는 것으로, 대학은 다음 사항에 동의합니다:
                </li>
                <li>
                  대학은 gradabroad.net 플랫폼을 통해 지원한 학생들과의 모든 소통을 해당 플랫폼을 통해서만 진행해야 합니다.
                </li>
                <li>
                  대학은 이 학생들과 <strong>외부 채널(예: 개인 이메일, 전화, 타 웹사이트 등)</strong>을 통해 연락하거나 응답해서는 안 됩니다.
                </li>
                <li>
                  학생이 외부 채널(예: 이메일, 메신저 앱 등)을 통해 대학에 개별적으로 연락을 시도한 경우, 대학은 학생에게 공식적인 모든 소통은 gradabroad.net을 통해 이루어진다는 점을 안내하고 플랫폼을 통해 다시 소통할 것을 정중하게 요청해야 합니다.
                </li>
                <li>
                  이 정책은 입학 절차의 투명성, 책임성 및 개인정보 보호를 보장하기 위해 마련되었습니다.
                </li>
                <li>
                  본 오퍼에 동의함으로써 대학은 위의 소통 정책을 성실히 이행할 것임을 확인합니다.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
