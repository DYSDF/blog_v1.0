(function(){var a=JSON.parse(document.getElementById("django-admin-popup-response-constants").dataset.popupResponse);switch(a.action){case "change":opener.dismissChangeRelatedObjectPopup(window,a.value,a.obj,a.new_value);break;case "delete":opener.dismissDeleteRelatedObjectPopup(window,a.value);break;default:opener.dismissAddRelatedObjectPopup(window,a.value,a.obj)}})();