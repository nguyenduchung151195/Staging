import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import minimapModule from 'diagram-js-minimap';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import customControlsModule from './customControlsModule';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import download from './download';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import './app.css';
import Button from '@material-ui/core/Button';
import AutomationDialog from '../../components/AutomationDialogTwo';
import { xml } from './xml';
import { API_WORKFLOW, API_COMMON_MODULE_WORKFLOW } from '../../config/urlConfig';
import { Grid } from '@material-ui/core'
import { clientId } from '../../variable';
export default function Automation(props) {
  const token = localStorage.getItem('token');

  const [modelerIstance, setModelerIstance] = useState(null);
  const myBpmn = useRef();
  const myPalette = useRef();
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  // automation
  const [openDialogBpmn, setOpenDialogBpmn] = useState(false);
  const [viewConfig, setViewConfig] = useState([]);
  const [isEditting, setIsEditting] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [dataXml, setDataXml] = useState(xml);
  const [module, setModule] = useState('Task');
  const [serviceTask, setServiceTask] = useState(false);
  const [exclusiveGateway, setExclusiveGateway] = useState(false);
  const [listModule, setListModule] = useState([])

  function handleSaveSvg() {
    modelerIstance.saveSVG({}, function (err, svg) {
      download(svg, 'fileSvg.svg', 'application/xml');
    });
  }
  const handleCloseDialog = () => {
    setServiceTask(false);
    setExclusiveGateway(false);
    setOpenDialogBpmn(false);
    setData({});
  };

  const handleCancel = () => {
    setLoad(true);
  };

  const handleSubmit = async () => {
    postData();
  };

  useEffect(() => {
    axios
      .get(`${API_COMMON_MODULE_WORKFLOW}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(data => {
        Object.values(data.data).map((item) => {
          listModule.push(item);
        })
      })
      .catch(function (error) {
        console.log('lỗi rồi', error);
      });
    localStorage.setItem('moduleWF', JSON.stringify([]))
    localStorage.setItem('Amodule', JSON.stringify('Bill'))
  }, [])

  const postData = () => {
    let data = JSON.parse(localStorage.getItem('automation'));
    modelerIstance.saveXML({ format: true }, function (err, xml) {
      if (xml) {
        if (checkUpdate) {
          axios
            .put(
              `${API_WORKFLOW}/All`,
              { id: 'All', data: { xml: xml, data: [...data], clientId: clientId } },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .then(() => {
              alert('Lưu thành công!');
            })
            .catch(error => {
              alert('Lưu thất bại!');
            });
        } else {
          axios
            .post(
              `${API_WORKFLOW}`,
              { id: 'All', data: { xml: xml, data: [...data], clientId: clientId } },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .then(() => {
              alert('Lưu thành công!');
            })
            .catch(error => {
              alert('Lưu thất bại!');
            });
        }
      }
    });

  };
  useEffect(
    () => {
      setDataXml(xml);
      if (module) {
        const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfig = viewConfigLocalStorage.find(d => d.code === module);
        setViewConfig(currentViewConfig);
      }
      axios
        .get(`${API_WORKFLOW}/All`, { headers: { Authorization: `Bearer ${token}` } })
        .then(data => {
          console.log(9999, data);
          let check = false;
          if (data.data.data.id === 'All') {
            if (data.data.data.data.xml.length > 0) {
              setDataXml(data.data.data.data.xml);
            }
            else
              setDataXml(xml);
            check = true;
            setCheckUpdate(true);
            localStorage.setItem('automation', JSON.stringify([...data.data.data.data.data]));
          }
          if (check === false) {
            setDataXml(xml);
            localStorage.setItem('automation', JSON.stringify([]));
          }
        })
        .catch(function (error) {
          console.log('lỗi rồi', error);
        });
      setLoad(false);
    },
    [load, module],
  );

  useEffect(
    () => {
      if (!myBpmn || !myBpmn.current || !myPalette || !myPalette.current) return;
      const modeler = new BpmnModeler({
        container: myBpmn.current,
        additionalModules: [
          customControlsModule,
          minimapModule,
          ZoomScrollModule,
          propertiesPanelModule,
          propertiesProviderModule,
          BpmnColorPickerModule,
        ],
        //       moddleExtensions: {
        //         camunda: camundaModdlePackage,
        //       },

        // bpmnRenderer: {
        //    defaultFillColor: "#333",
        //     defaultStrokeColor: "#fff"
        //    },
        // propertiesPanel: {
        //   parent: myPalette.current,
        // },
      });
      // modeler.on('element.changed', event => {
      //   const element = event.element;

      //   console.log('element', element);
      // });

      var eventBus = modeler.get('eventBus');

      // you may hook into any of the following events
      var events = ['element.hover', 'element.out', 'element.click', 'element.dblclick', 'element.mousedown', 'element.mouseup'];

      // events.forEach(function (event) {
      //   eventBus.on(event, function (e) {
      //     // element = the model element
      //     // e.gfx = the graphical element
      //     console.log(event, "on", element.type);
      //   });
      // });

      //event delete task
      eventBus.on('shape.remove', function (e) {
        let { element } = e
        let array = [...JSON.parse(localStorage.getItem('automation'))];
        if (element.type !== 'bpmn:Task' && element.type.indexOf('Task') !== -1 || element.type === 'bpmn:ExclusiveGateway') {
          let index = 0;
          let i = 0;
          array.map(item => {
            index++;
            if (item.id === element.businessObject.id) {
              i = index;
            }
          });
          array.splice(i - 1, 1);
          localStorage.setItem('automation', JSON.stringify(array));
        }
      });
      //event delete flow
      eventBus.on('connection.remove', function (e) {
        let { element } = e
        let array = [...JSON.parse(localStorage.getItem('automation'))];
        if (element.businessObject.$type === 'bpmn:SequenceFlow') {
          let index = 0;
          array.map(item => {
            index++;
            if (item.id === element.businessObject.id) {
              array.splice(index - 1, 1);
            }
          });
          localStorage.setItem('automation', JSON.stringify(array));
        }
      });
      //event click 
      eventBus.on('element.click', function (e) {
        let { element } = e
        let item1 = {};
        element.parent.children.map((item) => {
          if (item.type === 'bpmn:ServiceTask') {
            item1 = item;
          }
        })
        let arrayData = JSON.parse(localStorage.getItem('automation'));
        arrayData.map((item) => {
          if (item1.id === item.id) {
            localStorage.setItem('Amodule', JSON.stringify(item.data.moduleCode))
          }
        })
        //kiểm tra loại điều kiện
        if (element.type === 'bpmn:SequenceFlow') {
          let arrayData = JSON.parse(localStorage.getItem('automation'));
          let count = false;
          arrayData.map(item => {
            if (item.id === element.businessObject.id) {
              count = true;
              setData({
                data: item.data, target: element.target.id,
                source: element.source.id, id: element.id, type: element.type
              });
            }
          });
          if (count) {
            setIsEditting(true);
          } else {
            setIsEditting(false);
            setData({
              data: null, target: element.target.id,
              source: element.source.id, id: element.id, type: element.type
            });
          }
          setHidden(true);
          setOpenDialogBpmn(true);
        }

        //kiểm tra cấu hình
        if (element.type === 'bpmn:ServiceTask') {

          let arrayData = JSON.parse(localStorage.getItem('automation'));
          let count = false;
          arrayData.map(item => {
            if (item.id === element.businessObject.id) {
              count = true;
              setData({
                data: item.data, outgoing: element.outgoing,
                incoming: element.incoming, id: element.id, type: element.type
              });
            }
          });
          if (count) {
            setIsEditting(true);
          } else {
            setIsEditting(false);
            setData({
              data: null, outgoing: element.outgoing,
              incoming: element.incoming, id: element.id, type: element.type
            });
          }
          setServiceTask(true);
          setOpenDialogBpmn(true);
        }

        //kiểm tra confirm

        if (element.type === 'bpmn:ExclusiveGateway') {
          console.log(1111, element);
          let arrayData = JSON.parse(localStorage.getItem('automation'));
          let count = false;
          arrayData.map(item => {
            if (item.id === element.businessObject.id) {
              count = true;
              setData({
                data: item.data, outgoing: element.outgoing,
                incoming: element.incoming, id: element.id, type: element.type
              });
            }
          });
          if (count) {
            setIsEditting(true);
          } else {
            setIsEditting(false);
            setData({
              data: null, outgoing: element.outgoing,
              incoming: element.incoming, id: element.id, type: element.type
            });
          }
          setExclusiveGateway(true);
          setOpenDialogBpmn(true);
        }
        //kiểm tra loại hành động
        if (element.type !== 'bpmn:Task' && element.type.indexOf('Task') !== -1) {
          let count = false;
          let arrayData = JSON.parse(localStorage.getItem('automation'));
          arrayData.map(item => {
            if (item.id === element.businessObject.id) {
              count = true;
              setData({
                data: item.data, outgoing: element.outgoing,
                incoming: element.incoming, id: element.id, type: element.type
              });
            }
          });
          if (count) {
            setIsEditting(true);
          } else {
            setIsEditting(false);
            setData({
              data: null, outgoing: element.outgoing,
              incoming: element.incoming, id: element.id, type: element.type
            });
          }
          setHidden(false);
          setOpenDialogBpmn(true);
        }
      });
      var elements = document.getElementsByClassName('entry');
      Array.from(elements).map((e, index) => {
        if (index !== 3 && index !== 4 && index !== 5 && index !== 6 && index !== 7 && index !== 8 && index !== 10 && index !== 13) {
          e.parentNode.removeChild(e);
        }
      });
      modeler.importXML(dataXml, function (err) {
        if (err) {
          console.log('error rendering', err);
        }
      });
      setModelerIstance(modeler);
      return () => modeler.destroy();
    },
    [dataXml, load, viewConfig],
  );
  useEffect(() => {
    return () => {
      localStorage.removeItem('automation');
      localStorage.removeItem('moduleWF');
      localStorage.removeItem('Amodule');
    };
  }, []);
  return (
    <>
      <Modeler>
        <Bpmn ref={myBpmn} />
        <div className="bpmn-p-p">
          <Palette ref={myPalette} />
        </div>
      </Modeler>
      {openDialogBpmn ? (
        <AutomationDialog
          viewConfig={viewConfig}
          isEditting={isEditting}
          handleCloseDialog={() => handleCloseDialog()}
          open={openDialogBpmn}
          nameViewConfig={false}
          data={data}
          hidden={hidden}
          serviceTask={serviceTask}
          listModule={listModule}
          exclusiveGateway={exclusiveGateway}
        />
      ) : null}
      <Grid container>
        <Grid item xs={6}>
        </Grid>
        <Grid item xs={6} container style={{ justifyContent: 'flex-end' }} >
          <Grid item style={{ textAlign: 'right' }} xs={2}>
            <Button variant="contained" color="primary" onClick={() => handleSaveSvg()}>
              Tải ảnh
            </Button>
          </Grid>
          <Grid item style={{ textAlign: 'center' }} xs={3}>
            <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
              Lưu Automation
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="secondary" onClick={() => handleCancel()}>
              Hủy
            </Button>
          </Grid>
        </Grid>
        {/* <Grid item xs={6} spacing={12} style={{ textAlign: "right" }}> */}
      </Grid>
      {/* </Grid> */}
    </>
  );
}

const Modeler = styled.div`
  width: 84.9vw;
  height: 82vh;
  display: flex;
`;

const Palette = styled.div`
  width: 26vw;
  overflow-x: hidden;
  display: none;
`;
const Bpmn = styled.div`
  width: 100vw;
`;
