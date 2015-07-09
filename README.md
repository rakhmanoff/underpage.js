# underpage.js
Library for a user interaction with HTML widgets in the UnderPage project.

### Usage

    <script src="underpage.js"></script>

    <script type="text/javascript">
      var method = 'goToPage';
      var params = {
        number: 1
      };

      Underpage.exec(method, params);
    </script>