import FAQIllus from "/Illustrations/faqillus.png";
import { Collapse, CollapseProps } from "antd";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "How does the Timetable Architect work?",
    children: (
      <p>
        The Timetable Architect lets you design and organize personalized
        schedules by dragging and dropping classes, setting priorities, and
        adjusting for conflicts in real time.
      </p>
    ),
  },
  {
    key: "2",
    label: "Can I customize my timetable?",
    children: (
      <p>
        Yes, users can often customize timetables based on specific needs, such
        as preferred time slots, room assignments, or teacher availability.
      </p>
    ),
  },
  {
    key: "3",
    label: "How do I apply for access to the Timetable Architect?",
    children: (
      <p>
        {` To apply for access to the Timetable Architect, check if your
        institution or organization provides it, as they may offer a sign-up
        link or invite. If it's independent, visit the official website, look
        for an "Apply" or "Request Access" section, and complete the application
        form.`}
      </p>
    ),
  },
  {
    key: "4",
    label: "How does the Timetable Architect handle conflicts in scheduling?",
    children: (
      <p>
        The Timetable Architect detects conflicts by highlighting overlapping
        time slots or courses and suggests alternative arrangements or times
        based on your available options.
      </p>
    ),
  },
];

const FAQ = () => {
  return (
    <div className="grid grid-cols-2 px-36 py-12">
      <img draggable={false} src={FAQIllus} alt="faq" className="h-[380px]" />
      <div className="flex flex-col space-y-8">
        <h1 className="font-bold text-3xl">FAQ?</h1>
        <Collapse items={items} defaultActiveKey={["2"]} />
      </div>
    </div>
  );
};

export default FAQ;
