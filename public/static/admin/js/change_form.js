(function(a){a(document).ready(function(){var c=a("#django-admin-form-add-constants").data("modelName");a(".add-another").click(function(b){b.preventDefault();b=a.Event("django:add-another-related");a(this).trigger(b);b.isDefaultPrevented()||showAddAnotherPopup(this)});c&&a("form#"+c+"_form :input:visible:enabled:first").focus()})})(django.jQuery);
