import React from 'react'
import { Modal, Button, Text, Input, Textarea, Spacer, Row } from "@nextui-org/react";
import './email.css'
export default function Addemail() {

   function Viewtemplate(ele){
    let iframe = document.getElementById("preview_iframe")
    //     iframe.innerHTML = ele
    //     console.log("aarti",ele);
    // let iframe = $('iframe')[0]
    iframe.contentWindow.document.open();
    iframe.contentDocument.write(ele);
    iframe.contentWindow.document.close();

    }
    return (
        <div>
            <form>
            <Row >
            <Input
                label="Template Name"
             clearable
              bordered 
              labelPlaceholder="Name" 
              initialValue="NextUI" />
             <Spacer y={2.5} />      
                <Input
                    label="Template Content"
                     clearable
                bordered 
                labelPlaceholder="Name" 
                initialValue="NextUI" />
                <Spacer y={2.5} /> 
                </Row>
                 <Row>

             
                 <Textarea
                  label="Template Content"
                  clearable
                // width="700px"
                // heigth="50%"
                 minRows={20000}
                    // size="xl"
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Enter your template content."
                  onChange={(e)=>{
                      Viewtemplate(e.target.value)
                  }}
                // contentLeft={<Mail fill="currentColor" />}
                />
                <Spacer y={0.4} />  
                   <iframe id="preview_iframe" className="view-template"
                       width="450" height="538" >
                    </iframe> 
                    </Row>
            </form>     
               </div>
    )
}
