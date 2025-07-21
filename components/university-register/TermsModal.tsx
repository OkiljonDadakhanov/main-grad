import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";

export function TermsModal({
  open,
  onClose,
  setAgreed,
}: {
  open: boolean;
  onClose: () => void;
  setAgreed: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const el = ref.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setAgreed();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Scroll to the bottom and click "I Agree".
          </DialogDescription>
        </DialogHeader>

        <div
          ref={ref}
          onScroll={handleScroll}
          className="overflow-y-auto p-3 text-sm text-gray-700 space-y-4 grow"
        >
          <h2 className="text-base font-semibold">1. General Provisions</h2>
          <p>
            These terms govern the use of the "gradabroad.net" platform. The
            platform provides services specifically for South Korean
            universities and facilitates effective collaboration with students.
            By using "gradabroad.net," you agree to these terms.
          </p>
          <h2 className="text-base font-semibold">
            2. Description of Services
          </h2>
          <p>
            Through the "gradabroad.net" platform, South Korean universities can
            access the following free services:
          </p>
          <ul className="list-disc pl-5">
            <li>Accepting and reviewing student applications.</li>
            <li>Automating and managing the university admission process.</li>
            <li>Delivering admission results to students.</li>
          </ul>
          <p>
            <strong>Note:</strong> Universities using the Econom (Free) plan do
            not have access to:
          </p>
          <ul className="list-disc pl-5">
            <li>Posting advertisements.</li>
            <li>Uploading video content.</li>
          </ul>
          <h2 className="text-base font-semibold">3. Payment Conditions</h2>
          <ul className="list-disc pl-5">
            <li>The Econom plan is completely free of charge.</li>
            <li>No subscription fees or hidden costs apply.</li>
          </ul>
          <h2 className="text-base font-semibold">4. User Responsibilities</h2>
          <ul className="list-disc pl-5">
            <li>
              Universities must use the platform lawfully and in accordance with
              the specified rules.
            </li>
            <li>
              Applications must be reviewed fairly, and results must be
              delivered promptly.
            </li>
          </ul>
          <h2 className="text-base font-semibold">
            5. gradabroad.net Responsibilities
          </h2>
          <ul className="list-disc pl-5">
            <li>
              Ensuring the quality of services and providing technical support.
            </li>
            <li>
              Keeping university data confidential and disclosing it only to the
              Ministries of Education of Uzbekistan and South Korea.
            </li>
          </ul>
          <h2 className="text-base font-semibold">6. Validity of Terms</h2>
          <p>
            These terms and conditions apply upon the university's registration
            and use of the Econom (Free) plan.
          </p>
          <h2 className="text-base font-semibold">7. Contact Information</h2>
          <p>
            For inquiries or issues, please contact:
            <br />
            <strong>"gradabroad.net" Platform</strong>
            <br />
            Email: gradabroadltd@gmail.com
          </p>
          <hr className="border-t border-gray-300" />
          <h2 className="text-base font-semibold">
            사용 약관: 에코놈 (무료) 요금제
          </h2>
          <h3 className="font-semibold">1. 일반 조항</h3>
          <p>
            이 약관은 "gradabroad.net" 플랫폼의 이용 규정을 명시합니다. 본
            플랫폼은 한국 대학을 위한 맞춤형 서비스를 제공하며 학생들과 효과적인
            협력을 지원합니다. "gradabroad.net"를 사용함으로써 귀하는 본 약관에
            동의하는 것으로 간주됩니다.
          </p>
          <h3 className="font-semibold">2. 서비스 설명</h3>
          <p>다음의 무료 서비스를 이용할 수 있습니다:</p>
          <ul className="list-disc pl-5">
            <li>학생 지원서 접수 및 검토</li>
            <li>대학 입학 절차의 자동화 및 관리</li>
            <li>입학 결과를 학생들에게 전달</li>
          </ul>
          <p>
            <strong>참고:</strong> 아래 서비스는 사용할 수 없습니다:
          </p>
          <ul className="list-disc pl-5">
            <li>광고 게시</li>
            <li>동영상 콘텐츠 업로드</li>
          </ul>
          <h3 className="font-semibold">3. 결제 조건</h3>
          <ul className="list-disc pl-5">
            <li>에코놈 요금제는 완전히 무료입니다.</li>
            <li>구독 요금이나 숨겨진 비용이 없습니다.</li>
          </ul>
          <h3 className="font-semibold">4. 사용자 의무</h3>
          <ul className="list-disc pl-5">
            <li>
              대학은 플랫폼을 법적이고 명시된 규정에 따라 사용해야 합니다.
            </li>
            <li>지원서를 공정하게 검토하고 결과를 신속히 전달해야 합니다.</li>
          </ul>
          <h3 className="font-semibold">5. gradabroad.net의 의무</h3>
          <ul className="list-disc pl-5">
            <li>서비스 품질을 보장하고 기술 지원을 제공합니다.</li>
            <li>
              대학 데이터를 기밀로 유지하며 우즈베키스탄 및 한국 교육부에만
              공개합니다.
            </li>
          </ul>
          <h3 className="font-semibold">6. 약관 유효 기간</h3>
          <p>
            이 약관은 대학이 에코놈(무료) 요금제를 등록하고 사용하는 즉시
            적용됩니다.
          </p>
          <h3 className="font-semibold">7. 연락처 정보</h3>
          <p>
            문의사항이나 문제가 있을 경우 아래로 연락해 주십시오:
            <br />
            <strong>"gradabroad.net" 플랫폼</strong>
            <br />
            이메일: gradabroadltd@gmail.com
          </p>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => toast("Please scroll to bottom to agree.")}
            disabled
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
