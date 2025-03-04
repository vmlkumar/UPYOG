import { Loader, Modal, FormComposer } from "@upyog/digit-ui-react-components";
import React, { useState, useEffect } from "react";

import { configEWApproverApplication} from "../config";


const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode }) => {

  console.log("snjdskbjdfbjskfjkbs",action);
  const { data: approverData, isLoading: PTALoading } = Digit.Hooks.useEmployeeSearch(
    tenantId,
    {
      roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
      isActive: true,
   
    },
    { enabled: !action?.isTerminateState }


  );




  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [pickUpDate,setpickUpDate]=useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
 
  const [disableActionSubmit, setDisableActionSubmit] = useState(false);

  

  useEffect(() => {
    setApprovers(approverData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
  }, [approverData]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("PTR", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);
  
  function submit(data) {
      let workflow = { action: action?.action, comments: data?.comments , businessService, moduleName: moduleCode };
      console.log("applicationData",data);

      if (uploadedFile)
        workflow["documents"] = [
          {
            documentType: action?.action + " DOC",
            fileName: file?.name,
            filestoreId: uploadedFile,
          },
          {
                 }
          
        ];
        applicationData.pickUpDate = data?.date
        applicationData.transactionId = data?.transactionId
        applicationData.finalAmount = data?.finalAmount

      submitAction({
        EwasteApplication: [
          {
            
            ...applicationData,
      
            workflow,
          },
        ],
      });
    //  } 
   
  }

  useEffect(() => {
    if (action) {
      setConfig(
        configEWApproverApplication({
            t,
            action,
            approvers,
            selectedApprover,
            setSelectedApprover,
            selectFile,
            uploadedFile,
            setUploadedFile,
            businessService,
          })
        );
      
    }
  }, [action, approvers, uploadedFile]);
console.log("conggg",config)
  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
    >
       
        <FormComposer
          config={config.form}
          noBoxShadow
          inline
          childrenAtTheBottom
          onSubmit={submit}
          defaultValues={defaultValues}
          formId="modal-action"
        />
      
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;
