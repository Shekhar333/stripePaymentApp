import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { plans } from "../constants";
import Container from "../components/Container";
function Plans({ user }) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const navigate = useNavigate();
  if (!user) {
    return <Navigate to="/" />;
  }
  const handleSubmit = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("plan", selectedPlan);
    queryParams.append("monthly", isMonthly);

    navigate(`/checkout?${queryParams.toString()}`);
  };
  return (
    <Container className={"flex justify-center items-center"}>
      <div className="flex flex-col p-9 py-10 items-center ">
        <h2 className=" text-2xl font-semibold w-full text-center mb-10">
          Choose the right plan for you
        </h2>
        <table className="table-fixed border-spacing-x-10 border-spacing-y-5">
          <tbody>
            <tr>
              <td className=" pr-28">
                <ToogleButton
                  isMonthly={isMonthly}
                  setIsMonthly={setIsMonthly}
                />
              </td>
              {plans.map((plan, index) => {
                const isSelected = index === selectedPlan;
                return (
                  <td className="p-[0.75rem]" key={plan.name}>
                    <div
                      className={`min-h-[100px] min-w-[100px] cursor-pointer flex items-center justify-center text-white relative rounded-sm ${
                        isSelected ? "bg-[#1E4D91]" : " bg-[#7894BD]"
                      }`}
                      onClick={() => setSelectedPlan(index)}
                    >
                      <p>{plan.name}</p>
                      {isSelected && (
                        <div className="w-3 h-3 bg-[#1E4D91] transform rotate-45 absolute bottom-0 translate-y-[50%] "></div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
            {/* //monthly pricing */}
            <TableRow name="Monthly pricing">
              {plans.map((plan, index) => {
                const selected = index === selectedPlan;
                return (
                  <td>
                    <p
                      className={`${
                        selected ? "text-[#1E4D91]" : " text-gray-500"
                      } font-semibold text-sm w-full text-center`}
                    >
                      ₹ {isMonthly ? plan.price.monthly : plan.price.yearly}
                    </p>
                  </td>
                );
              })}
            </TableRow>
            {/* //video quality */}
            <TableRow name="Video quality">
              {plans.map((plan, index) => {
                const selected = index === selectedPlan;
                return (
                  <td>
                    <p
                      className={`${
                        selected ? "text-[#1E4D91]" : " text-gray-500"
                      } font-semibold text-sm w-full text-center`}
                    >
                      {plan.videoQuality}
                    </p>
                  </td>
                );
              })}
            </TableRow>
            {/* //resolution */}
            <TableRow name="Resolution">
              {plans.map((plan, index) => {
                const selected = index === selectedPlan;
                return (
                  <td>
                    <p className="text-gray-500 font-semibold text-sm w-full text-center">
                      {plan.resolution}
                    </p>
                  </td>
                );
              })}
            </TableRow>
            {/* //devices */}
            <TableRow
              name="Devices you can use to watch"
              noBottom
              notext
              className={"mb-0"}
            ></TableRow>
            <TableRow noName={true} noBottom>
              {plans.map((plan, index) => {
                const selected = index === selectedPlan;
                return (
                  <td>
                    <div className="flex flex-col gap-5 mb-auto">
                      {plan.devices.map((device) => (
                        <p
                          className={`w-full text-center text-[0.7rem] font-semibold ${
                            selected ? "text-[#1E4D91]" : " text-gray-500"
                          }
                            ${device === "x" ? " opacity-0 " : ""}
                          `}
                        >
                          {device}
                        </p>
                      ))}
                    </div>
                  </td>
                );
              })}
            </TableRow>
          </tbody>
        </table>
        <button
          className="bg-[#1E4D91] text-white px-32 py-1 rounded-sm mt-5"
          onClick={handleSubmit}
        >
          Next
        </button>
      </div>
    </Container>
  );
}

export default Plans;
// 1E4D91
// 7894BD
const ToogleButton = ({ isMonthly, setIsMonthly }) => {
  const css = "px-2 py-2 rounded-full text-sm font-medium";
  return (
    <div className="flex gap-2 bg-[#1E4D91] max-w-min p-2 rounded-full">
      <button
        className={`${
          isMonthly ? "bg-white text-[#1E4D91]" : "bg-none text-white"
        } ${css}`}
        onClick={() => setIsMonthly(true)}
      >
        Monthly
      </button>
      <button
        className={`${
          !isMonthly ? "bg-white text-[#1E4D91]" : "bg-none text-white"
        } ${css}`}
        onClick={() => setIsMonthly(false)}
      >
        Yearly
      </button>
    </div>
  );
};

const TableRow = ({ className, name, noBottom, notext, noName, children }) => {
  return (
    <tr className={noBottom ? "" : "border-b-[1px] border-gray-200 "}>
      <td>
        <p className={"my-3 pl-4 text-sm " + className}>{noName ? "" : name}</p>
      </td>
      {notext ? <></> : children}
    </tr>
  );
};
