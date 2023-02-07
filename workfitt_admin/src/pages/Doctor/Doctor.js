import React, { useState, useEffect } from 'react'
import { Tooltip, Text, Switch } from "@nextui-org/react";
import ViewDataTable from "../../component/ViewDataTable";
import { StyledBadge } from "../../component/Icons/StyledBadge";
import { IconButton } from "../../component/Icons/IconButton";
import { EditIcon } from "../../component/Icons/EditIcon";
import { DeleteIcon } from "../../component/Icons/DeleteIcon";
import FormModal from "../../component/Modal/FormModal";

import updateDoctor from '../../api/Doctor_Api/updateDoctor';
import doctorList from '../../api/Doctor_Api/doctorList';
import deleteDoctor from '../../api/Doctor_Api/deleteDoctor';
import addDoctor from '../../api/Doctor_Api/addDoctor';